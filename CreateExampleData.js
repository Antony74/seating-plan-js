
var fs = require('fs');
var faker = require('faker');

faker.seed(1);

var arrTables =
[
	{'tableName': 'Caru',     'guests': []},
	{'tableName': 'William',  'guests': []},
	{'tableName': 'Shandy',   'guests': []},
	{'tableName': 'Kyra',     'guests': []},
	{'tableName': 'Glockton', 'guests': []},
	{'tableName': 'Brenin',   'guests': []},
];

for (var nTable = 0; nTable < arrTables.length; ++nTable)
{
	for (var nGuest = 0; nGuest < 10; ++nGuest)
	{
		arrTables[nTable].guests.push(faker.name.firstName() + ' ' + faker.name.lastName());
	}
}

var sOutput = JSON.stringify(arrTables, null, 4);

fs.writeFile(__dirname + '/data.json', sOutput, function() {});

