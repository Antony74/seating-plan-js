
var fs = require('fs');

//
// Load data
//

var arrTables = JSON.parse(fs.readFileSync(__dirname + '/data.json'));

//
// Ensure output directory exists
//

if (!fs.existsSync(__dirname + '/output'))
{
    fs.mkdirSync(__dirname + '/output');
}

//
// Begin writing SVG
//

var fileSvg = fs.openSync(__dirname + '/output/SeatingPlan.svg', 'w');

//594x420mm is A2 Landscape
var width  = 594;
var height = 420;

print('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"');
print('     version="1.1" width="' + width + 'mm" height="' + height + 'mm">');
print('<title>Seating Plan</title>');

// Draw a border
var style = 'stroke: black; fill: none';
rect(20, 20, width - 40, height - 40);

// Configure the top table
var style = 'stroke: black; fill: rgb(200, 200, 200); stroke-width: 1mm';
var x = 297;
var y = 75;
var tWidth = 200;
var tHeight = 25;
var tLeft = x - (tWidth/2);
var tTop = y - (tHeight/2);
var chairRadius = 8;

var style = 'stroke: black; fill: rgb(128, 128, 128); stroke-width: 1mm';
var arrGuests = arrTables[0].guests;

// Draw seats
for (var nGuest = 0; nGuest < arrGuests.length; ++nGuest)
{
    var sGuest = arrGuests[nGuest];

    var xGuest = tLeft + (nGuest * tWidth / (arrGuests.length - 1));
    var yGuest = tTop;

    ellipse(xGuest, yGuest, chairRadius, chairRadius);
}

// Draw the top table
var style = 'stroke: black; fill: rgb(200, 200, 200); stroke-width: 1mm';
rect(tLeft - 12, tTop, tWidth + 24, tHeight);

var imgWidth = tWidth * 0.4;
y = 40;

print('<mask id="maskCaru">');
rect(tLeft - 12, tTop, tWidth + 24, tHeight);
print('</mask>');

print('<mask id="maskNegCaru">');
rect(-(tLeft - 12 + tWidth + 24), tTop, tWidth + 24, tHeight);
print('</mask>');

x = tLeft + tWidth + 12 - imgWidth;

print('<image xlink:href="Caru.jpg"');
print('       x="' + x + 'mm" y="' + y + 'mm"');
print('       width="' + imgWidth + 'mm" height="' + imgWidth + 'mm"');
print('       mask="url(#maskCaru)"');
print('/>');

x = -tLeft - imgWidth + 12;

print('<image xlink:href="Caru.jpg"');
print('       x="' + x + 'mm" y="' + y + 'mm"');
print('       width="' + imgWidth + 'mm" height="' + imgWidth + 'mm"');
print('       mask="url(#maskNegCaru)"');
print('       transform="scale(-1,1)"');
print('/>');

x = (width - 30)/2;
text('Caru', x, 80, 35, 30);

var style = 'stroke: black; fill: none; stroke-width: 1mm';
rect(tLeft - 12, tTop, tWidth + 24, tHeight);

// Draw guests names

for (var n = 0; n < arrGuests.length; ++n)
{
    var sGuest = arrGuests[n];
    var xGuest = tLeft + (n * tWidth / (arrGuests.length - 1));

    var nameTop = (n % 2) ? tTop - 7 : tTop - 16;

    name(sGuest, xGuest, nameTop, 'centre');
}

// Draw other tables
var yFront = 155 + 25;
var yBack  = 260 + 25;
var spacing = 90;
var tableRadius = 30;

for (var nTable = 1; nTable < arrTables.length; ++nTable)
{
    var arrGuests = arrTables[nTable].guests;

    x = (width / 2) + (spacing * (nTable - 3));
    y = (nTable%2) ? yFront : yBack;

    // Draw the chairs - jolly useful guide for the eye as they can be evenly spaced, unlike the name tags
    var style = 'stroke: black; fill: rgb(128, 128, 128); stroke-width: 1mm';

    for (var nGuest = 0; nGuest < arrGuests.length; ++nGuest)
    {
        var sGuest = arrGuests[nGuest];
        var theta = 2 * Math.PI * nGuest / arrGuests.length;

        var xGuest = x + (30 * Math.cos(theta));
        var yGuest = y + (30 * Math.sin(theta));

        ellipse(xGuest, yGuest, chairRadius, chairRadius);
    }

    // Draw the table
    var style = 'stroke: black; fill: rgb(200, 200, 200); stroke-width: 1mm';
    ellipse(x, y, tableRadius, tableRadius);

	radialImage(arrTables[nTable].tableName,
				x,	             // xImg
				y,			     // yImg
				tableRadius*2.5, // width
				tableRadius*2.5, // height
				40);	         // radius

	if (arrTables[nTable].tableName.length <=4)
	{
		text(arrTables[nTable].tableName, x - 15, y + tableRadius - 7, 35, tableRadius*0.8);
	}
	else
	{
		text(arrTables[nTable].tableName, x - 20, y + tableRadius - 7, 35, tableRadius*1.2);
	}

    // Draw the guest's name
    for (var nGuest = 0; nGuest < arrGuests.length; ++nGuest)
    {
        var sGuest = arrGuests[nGuest];
        var theta = 2 * Math.PI * nGuest / arrGuests.length;

        var xGuest = x + (36 * Math.cos(theta));
        var yGuest = y + (36 * Math.sin(theta));

        var align = (xGuest > x) ? 'right' : 'left';

        name(sGuest, xGuest, yGuest, align);
    }
}

// And the main title is "Seating"
x = (width/2) - 60;
y = height - 45;
var arrNames  = [ 'x',      'y',       'font-weight', 'font-size' ];
var arrValues = [  x + 'mm', y + 'mm', 'bold',        '108pt'     ];

var s = '<text ';

for (var n = 0; n < arrNames.length; ++n)
{
    s += arrNames[n] + '="' + arrValues[n] + '" ';
}

s += '>';
s += 'Seating';
s += '</text>';
print(s);

// Now close the document

print('</svg>');
fs.closeSync(fileSvg);

//
// Various utility functions
//

function name(sText, x, y, align)
{
    var width = (sText.length * 2.5) + 2;
    var height = 7;

    y -= height/2;    

    if (align === 'left')
    {
        x -= width;
    }
    else if (align === 'centre')
    {
        x -= width / 2;
    }

    style = 'stroke: black; fill: white;';
    rect(x, y, width, height);

    var arrNames  = [ 'x',          'y',          'textLength',      'font-weight', 'font-size' ];
    var arrValues = [ (x+1) + 'mm', (y+5) + 'mm',  (width-2) + 'mm', 'bold',        '16pt'      ];

    var s = '<text ';

    for (var n = 0; n < arrNames.length; ++n)
    {
        s += arrNames[n] + '="' + arrValues[n] + '" ';
    }

    s += '>';
    s += sText;
    s += '</text>';

    print(s);
}

function print(s)
{
    fs.writeSync(fileSvg, s + '\n');
}

function rect(x, y, width, height, extra)
{
    var arrNames  = ['x',       'y',       'width',      'height',       'style'];
    var arrValues = [ x + 'mm',  y + 'mm',  width + 'mm', height + 'mm',  style ];

    var s = '<rect ';

    for (var n = 0; n < arrNames.length; ++n)
    {
        s += arrNames[n] + '="' + arrValues[n] + '" ';
    }

    if (extra)
    {
        s += extra;
    }

    s += '/>';

    print(s);
}

function ellipse(x, y, width, height)
{
    var arrNames  = ['cx',      'cy',      'rx',          'ry',           'style'];
    var arrValues = [ x + 'mm',  y + 'mm',  width + 'mm',  height + 'mm',  style ];

    var s = '<ellipse ';

    for (var n = 0; n < arrNames.length; ++n)
    {
        s += arrNames[n] + '="' + arrValues[n] + '" ';
    }

    s += '/>';

    print(s);
}

function text(sText, x, y, fontSize, textLength)
{
	var arrNames  = [ 'x',      'y',       'font-weight', 'font-size',     'stroke', 'fill',  'textLength'       ];
	var arrValues = [  x + 'mm', y + 'mm', 'bold',        fontSize + 'pt', 'blue',   'white',  textLength + 'mm' ];

	var s = '<text ';

	for (var n = 0; n < arrNames.length; ++n)
	{
		s += arrNames[n] + '="' + arrValues[n] + '" ';
	}

	s += '>';
	s += sText;
	s += '</text>';
	print(s);
}

function radialImage(sName, xImg, yImg, width, height, rPercent)
{
	var x = xImg - (width/2);
	var y = yImg - (height/2);

	print('<radialGradient id="gradient' + sName + '" gradientUnits="objectBoundingBox"');
	print('                fx="0%" fy="0%"');
	print('                cx="50%" cy="50%"');
	print('                r="' + rPercent + '%">');
	print('    <stop offset="0%"   stop-color="white" />');
	print('    <stop offset="70%"  stop-color="white" />');
	print('    <stop offset="100%" stop-color="black" />');
	print('</radialGradient>');

    print('<mask id="mask' + sName + '">');
    print('    <rect');
	print('          x="' + x + 'mm" y="' + y + 'mm"');
	print('          width="' + width + 'mm" height="' + width + 'mm"');
	print('          fill="url(#gradient' + sName + ')"  />');
    print('</mask>');

	print('<image xlink:href="' + sName + '.jpg"');
	print('       x="' + x + 'mm" y="' + y + 'mm"');
	print('       width="' + width + 'mm" height="' + width + 'mm"');
	print('       mask="url(#mask' + sName + ')"');
	print('/>');
}

