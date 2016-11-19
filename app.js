d0 = [];
d1 = [];
d2 = [];
d3 = [];
wheelError = [];
keyError = [];
wheelsum=0;
clicksum=0;
keysum = 0;
myColors = [];
MAX_OCL = 200;
var data = new Array();

function update(){
	d = new Date();
	t = d.getTime()/1000;
	d0.push([t,clicksum/5]);
	d1.push([t,wheelsum/10]);
	d2.push([t, 0.3*Math.sin(2*Math.PI/5*t)+2*Math.sin(2*Math.PI/100*t)]);
	d3.push([t,keysum/10]);
	if(d0.length > MAX_OCL){
		d0.shift();
	}
	if(d1.length > MAX_OCL){
		d1.shift();
	}
	if(d2.length > MAX_OCL){
		d2.shift();
	}
	if(d3.length > MAX_OCL){
		d3.shift();
	}
	var n;
	n = 0;
	data = new Array();
	myColors = [];
	if (true){
		data[n] = {
			data: d0,
			label: 'Mouse left and wheel click'
		};
		myColors.push('red');
		n=n+1;
	}

	if (true){
		data[n] = {
			data: d3,
			label: 'Keyboard 1, 7, 2, 8 press'
		};
		myColors.push('black');
		n=n+1;
	}
	if (true){
		data[n] = {
			data: d2,
			label: 'Target'
		};
		myColors.push('blue');
		n=n+1;
	}
	if (true){
		data[n] = {
			data: d1,
			label: 'Mouse wheel'
		};
		myColors.push('green');
		n=n+1;
	}
	for (i=0;i<d0.length; i++)
	{
	 wheelError[i] = d1[i][1]-d2[i][1]
	}
	for (i=0;i<d1.length; i++)
	{
	 keyError[i] = d3[i][1]-d2[i][1]
	}

	document.getElementById("demowheel").innerHTML = standardDeviation(wheelError)+Math.pow(average(wheelError),2);
	document.getElementById("democlick").innerHTML = standardDeviation(keyError)+Math.pow(average(keyError),2);
 }


setInterval(update,50);
	// Draw Graph
function drawGraph(){
		var graph, graph2;
		var container = document.getElementById("graphDiv");
		var container2 = document.getElementById("graphDiv2");
		//graph = Flotr.draw(container, [data[1], data[2]], {
		graph = Flotr.draw(container, data.slice(0,3), {
			//colors: [myColors[1], myColors[2]],
			colors: myColors.slice(0,3),
			xaxis: {
				minorTickFreq: 4
			}, 
			yaxis: {
				max: 3,
				min: -3
			},
			grid: {
				minorVerticalLines: true
			}
		});
		//graph2 = Flotr.draw(container2, [data[0],data[2], data[3]], {

		graph2 = Flotr.draw(container2, data.slice(2,4), {
			//colors: [myColors[0],myColors[2], myColors[3]],
			colors: myColors.slice(2,4),
			xaxis: {
				minorTickFreq: 4
			}, 
			yaxis: {
				max: 3,
				min: -3
			},
			grid: {
				minorVerticalLines: true
			}
		});

		// Reload
		setTimeout(function(){
			drawGraph();
		}, 100);
}
drawGraph();




var context = new (window.AudioContext || window.webkitAudioContext)();
var oscref = context.createOscillator(); // instantiate an oscillator
oscref.type = 'square'; // this is the default - also square, sawtooth, triangle
oscref.frequency.value = 440; // Hz
oscref.connect(context.destination); // connect it to the destination
oscref.start(); // start the oscillator
var osc = context.createOscillator(); // instantiate an oscillator
osc.type = 'square'; // this is the default - also square, sawtooth, triangle
osc.frequency.value = 440; // Hz
osc.connect(context.destination); // connect it to the destination
osc.start(); // start the oscillator



document.getElementById("demowheel").innerHTML = 0;
document.getElementById("democlick").innerHTML = 0;

document.addEventListener("wheel", function(ev){
	wheelsum= wheelsum-ev.deltaY/3
	osc.frequency.value = 440*Math.pow(1.1,wheelsum)
	if (wheelsum==0)
	{
		osc.frequency.value=0
	}
});
document.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Should do nothing if the key event was already consumed.
  }

  console.log(event.key)
  switch (event.key) {
    case "1":
      keysum=keysum-1
      break;
    case "7":
      keysum=keysum+1
      break;
    case "2":
      keysum = keysum -10
      break;
    case "8":
      keysum = keysum +10
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Consume the event for suppressing "double action".
  event.preventDefault();
}, true);

document.addEventListener("mousedown", function(event){
	if (event.which==1)
	{
		clicksum = clicksum -1
	}
	if (event.which==2)
	{
		clicksum = clicksum +1
	}
});
console.log("Eureka")

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}
