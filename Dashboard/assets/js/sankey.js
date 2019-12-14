function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'From');
  data.addColumn('string', 'To');
  data.addColumn('number', 'Percentage');
  data.addRows([
    [ 'Female', 'Survived', 29.8 ],
    [ 'Female', 'Survived', 20.4 ],
    [ 'Female', 'Survived', 22.7 ],
    [ 'Female', 'Died', 1.0 ],
    [ 'Female', 'Died', 2.5 ],
    [ 'Female', 'Died', 23.6 ],
    [ 'Male', 'Survived', 7.2 ],
    [ 'Male', 'Survived', 2.9 ],
    [ 'Male', 'Survived', 8.8 ],
    [ 'Male', 'Died', 14.3 ],
    [ 'Male', 'Died', 17.3 ],
    [ 'Male', 'Died', 49.5 ]
  ]);

  // Sets chart options.
  var colors = ['#A6CEE3', '#B2DF8A', '#FB9A99', '#FDBF6F',
                  '#CAB2D6', '#FFFF99', '#1F78B4', '#33A02C'];
  
  var options = {
    height: 400,
    sankey: {
        node: {
            colors: colors,
            label: {fontName: 'Arial',
                    fontSize: 20,
                    bold: true,
                    },
            nodePadding: 30

        },
        link: { colorMode: 'gradient',
              colors: colors,
              color: {stroke: 'grey',
                      strokeWidth: .2}
          }
        }
    };

  // Instantiates and draws our chart, passing in some options.
  var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
  chart.draw(data, options);
}