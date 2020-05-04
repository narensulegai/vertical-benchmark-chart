(function () {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host {
          --width: 2px;
          --circle-radius: 5px;
      }
      * {
          box-sizing: border-box;
      }
      
      .line {
          position: relative;
          width: 100%;
          box-shadow: 0 1px 0 0 black;
          height: 100px;
      }
      
      .box {
          position: absolute;
          min-width: var(--width);
          height: 100%;
      }
      
      .diagonal-ltr, .diagonal-rtl {
          height: 100%;
          width: 100%;
          background: gray;
          position: absolute;
          top: 50%;
      }
      
      .circle-tr, .circle-tl, .circle-bl, .circle-br {
          height: calc(var(--circle-radius) * 2);
          width: calc(var(--circle-radius) * 2);
          border-radius: var(--circle-radius);
          background: gray;
          position: absolute;
          box-shadow: 2px 2px 3px -1px black;
      }
      
      .circle-tr {
          top: calc(50% - var(--circle-radius));
          right: calc(var(--circle-radius) * -1);
      }
      
      .circle-tl {
          top: calc(50% - var(--circle-radius));
          left: calc(var(--circle-radius) * -1);
      }
      
      .circle-bl {
          bottom: calc(-50% - var(--circle-radius));
          left: calc(var(--circle-radius) * -1);
      }
      
      .circle-br {
          bottom: calc(-50% - var(--circle-radius));
          right: calc(var(--circle-radius) * -1);
      }
      
      .diagonal-ltr {
          clip-path: polygon(var(--width) 0, 100% calc(100% - var(--width)), calc(100% - var(--width)) 100%, 0% var(--width));
      }
      
      .diagonal-rtl {
          clip-path: polygon(calc(100% - var(--width)) 0, 100% var(--width), var(--width) 100%, 0% calc(100% - var(--width)));
      }
    </style>
  `;

  class VerticalBenchmarkChart extends HTMLElement {

    constructor() {
      super();
    }

    createConnectingLine(from, to, color) {
      const box = document.createElement('div');
      const diagonal = document.createElement('div');
      const circleTop = document.createElement('div');
      const circleBottom = document.createElement('div');

      diagonal.style.backgroundColor = color;
      circleTop.style.backgroundColor = color;
      circleBottom.style.backgroundColor = color;

      box.className = "box";

      if (to >= from) {
        diagonal.className = 'diagonal-ltr';
        circleTop.className = 'circle-tl';
        circleBottom.className = 'circle-br';
        box.style.left = from * 100 + '%';
      } else {
        diagonal.className = 'diagonal-rtl';
        circleTop.className = 'circle-tr';
        circleBottom.className = 'circle-bl';
        box.style.left = to * 100 + '%';
      }
      box.style.width = Math.abs(from - to) * 100 + '%';

      box.appendChild(diagonal);
      box.appendChild(circleTop);
      box.appendChild(circleBottom);

      return box;
    }

    connectedCallback() {
      const templateHtml = template.content.cloneNode(true);

      const shadowDom = this.attachShadow({mode: "open"});
      shadowDom.appendChild(templateHtml);

      const series = JSON.parse(this.getAttribute('series'));

      const newSeries = series.reduce((m, s) => {
        s.series.forEach((e, i) => {
          if (m[i] === undefined) {
            m[i] = [e]
          } else {
            m[i].push(e)
          }
        });
        return m;
      }, []);

      newSeries.forEach(s => {
        const line = document.createElement('div');
        line.className = 'line';
        s.forEach((l, i) => {
          if (l.from !== null && l.to) {
            const box = this.createConnectingLine(l.from, l.to, series[i].color);
            line.appendChild(box);
          }
        });
        shadowDom.appendChild(line);
      });

    }
  }

  customElements.define('vertical-benchmark-chart', VerticalBenchmarkChart);
})();

