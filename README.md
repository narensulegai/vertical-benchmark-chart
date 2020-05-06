# vertical-benchmark-chart
Web component to show benchmarks vertically

View demo at https://narensulegai.github.io/vertical-benchmark-chart/demo/

Usage

```html

<html>
<head>
  <script type="text/javascript" src="verticalBenchmarkChart.js"></script>
</head>
<body>
    <vertical-benchmark-chart
            data='{
            "series":[
                {"values":[0.25, 0.50, 0.75, 1, 0, 0.25, 0.50, 0.75], "color":"blue"},
                {"values":[0.50, 0.25, 1, 0.5, 0.5, 0.75, 0.25, 0.25], "color":"green"}
            ],
            "labelsX" : ["Very Low", "Low", "Medium", "Average", "High"],
            "labelsY" : ["Human Resources", "Finance", "Information Technology", "Legal", "Tax", "Supplies", "Real-estate", "Transport"]}'>
    </vertical-benchmark-chart>
</body>


```

