export const calculator_data = [
    [{
        name: '',
        value: 'bs',
        label: "Back Space",
        operation:"clearData"
    }, {
        name: 'CE',
        value: 'ce',
        label: "Clear Entry",
        operation:"clearData"
    }, {
        name: 'C',
        value: 'c',
        label: "Clear",
        operation:"clearData"
    }, {
        name: '&divide',
        value: '/',
        label: 'Division',
        operation:"setSign"
    }],
    [{
        name: 7,
        value: 7,
        label: "7",
        operation:"setValue"
    }, {
        name: 8,
        value: 8,
        label: "8",
        operation:"setValue"
    }, {
        name: 9,
        value: 9,
        label: "9",
        operation:"setValue"
    }, {
        name: 'x',
        value: "*",
        label: 'Multiplication',
        operation:"setSign"
    }],
    [{
        name: 4,
        value: 4,
        label: "4",
        operation:"setValue"
    }, {
        name: 5,
        value: 5,
        label: "5",
        operation:"setValue"
    }, {
        name: 6,
        value: 6,
        label: "6",
        operation:"setValue"
    }, {
        name: '-',
        value: "-",
        label: 'Minus',
        operation:"setSign"
    }],
    [{
        name: 1,
        value: 1,
        label: "1",
        operation:"setValue"
    }, {
        name: 2,
        value: 2,
        label: "2",
        operation:"setValue"
    }, {
        name: 3,
        value: 3,
        label: "3",
        operation:"setValue"
    }, {
        name: '+',
        value: "+",
        label: 'Plus',
        operation:"setSign"
    }],
    [{
        name: '+/-',
        value: 'negate',
        label: "Sign",
        operation:"negate"
    }, {
        name: 0,
        value: 0,
        label: "0",
        operation:"setValue"
    }, {
        name: '.',
        value: ".",
        label: 'Point',
        operation:"setValue"
    }, {
        name: '=',
        value: '=',
        label: 'Equals',
        operation:"getResult"
    }]
];
