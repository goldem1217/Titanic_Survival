function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'From');
  data.addColumn('string', 'To');
  data.addColumn('number', 'Weight');
  data.addRows([
    [ 'Female', 'Survivied', 29.8 ],
    [ 'Female', 'Survivied', 20.4 ],
    [ 'Female', 'Survivied', 22.7 ],
    [ 'Female', 'Died', 1.0 ],
    [ 'Female', 'Died', 2.5 ],
    [ 'Female', 'Died', 23.6 ],
    [ 'Male', 'Survivied', 7.2 ],
    [ 'Male', 'Survivied', 2.9 ],
    [ 'Male', 'Survivied', 8.8 ],
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
            colors: colors
        },
        link: { colorMode: 'gradient',
              colors: colors
          }
        }
    };

  // Instantiates and draws our chart, passing in some options.
  var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
  chart.draw(data, options);
}