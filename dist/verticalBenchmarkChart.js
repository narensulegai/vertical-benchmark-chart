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
          height: 100%;
          flex: 50%;
          box-shadow: -1px 0 0 0 black;
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
      .label-x-container {
          position: relative;
          width: 50%;
          margin-left: 50%;
          box-shadow: 5px 4px 11px -6px #c1c0c0;
          height: 20px;
      }
      .label-x {
          position: absolute;
          width: 100px;
          margin-left: -50px;
          left: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
      }
      .label-container {
          display: flex;
          align-items: center;
          box-shadow: 0 1px 0 0 #c1c0c0;
          height: 50px;
      }
      .label-container:last-child {
          box-shadow: none;
      }
      .label {
          flex: 50%;
    
          padding-left: 20px;
      }
      .circle-tr, .circle-tl, .circle-bl, .circle-br {
          height: calc(var(--circle-radius) * 2);
          width: calc(var(--circle-radius) * 2);
          border-radius: var(--circle-radius);
          background: gray;
          position: absolute;
          box-shadow: 2px 2px 6px -2px black;
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

    createLabelX(labels) {
      const container = document.createElement('div');
      container.className = 'label-x-container';
      labels.forEach((label, i) => {
        const l = document.createElement('div');
        l.className = 'label-x';
        l.style.left = (i) / (labels.length - 1) * 100 + '%';
        l.textContent = label;
        container.appendChild(l);
      });
      return container;
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

      if (from === null && to === null) {
        //  nothing to do
      } else if (from === null || to === null) {
        if (from === null) {
          box.style.left = to * 100 + '%';
          circleBottom.className = 'circle-bl';
        }
        if (to === null) {
          box.style.left = from * 100 + '%';
          circleTop.className = 'circle-tl';
        }
      } else if (to >= from) {
        diagonal.className = 'diagonal-ltr';
        circleTop.className = 'circle-tl';
        circleBottom.className = 'circle-br';
        box.style.left = from * 100 + '%';
        box.style.width = Math.abs(from - to) * 100 + '%';
      } else {
        diagonal.className = 'diagonal-rtl';
        circleTop.className = 'circle-tr';
        circleBottom.className = 'circle-bl';
        box.style.left = to * 100 + '%';
        box.style.width = Math.abs(from - to) * 100 + '%';
      }

      box.appendChild(diagonal);
      box.appendChild(circleTop);
      box.appendChild(circleBottom);

      return box;
    }

    connectedCallback() {
      const templateHtml = template.content.cloneNode(true);

      const shadowDom = this.attachShadow({mode: "open"});
      shadowDom.appendChild(templateHtml);

      const data = JSON.parse(this.getAttribute('data'));

      const newSeries = data.series.reduce((m, s) => {

        for (let i = 0; i < s.values.length; i++) {
          const l = {from: null, to: null};
          l.from = s.values[i];
          l.to = s.values[i + 1] === undefined ? null : s.values[i + 1];
          if (m[i] === undefined) {
            m[i] = [l]
          } else {
            m[i].push(l)
          }
        }
        return m;
      }, []);

      const labelsX = this.createLabelX(data.labelsX);
      shadowDom.appendChild(labelsX);

      const createLabelContainer = (labelText) => {
        const labelContainer = document.createElement('div');
        const line = document.createElement('div');
        const label = document.createElement('div');
        label.textContent = labelText;
        label.className = 'label';
        line.className = 'line';
        labelContainer.className = 'label-container';
        labelContainer.appendChild(label);
        labelContainer.appendChild(line);
        return {labelContainer, line, label};
      };

      newSeries.forEach((s, j) => {
        const {labelContainer, line} = createLabelContainer(data.labelsY[j]);
        s.forEach((l, i) => {
          const box = this.createConnectingLine(l.from, l.to, data.series[i].color);
          line.appendChild(box);
        });
        shadowDom.appendChild(labelContainer);
      });
    }
  }

  customElements.define('vertical-benchmark-chart', VerticalBenchmarkChart);
})();

