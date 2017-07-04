export const calculator_data = [
    [{
        name: '',
        value: 'bs',
        label: "Back Space button",
        operation:"clearData"
    }, {
        name: 'CE',
        value: 'ce',
        label: "Clear Entry button",
        operation:"clearData"
    }, {
        name: 'C',
        value: 'c',
        label: "Clear button",
        operation:"clearData"
    }, {
        name: '&divide',
        value: '/',
        label: 'Division button',
        operation:"setSign"
    }],
    [{
        name: 7,
        value: 7,
        label: "7 button",
        operation:"setValue"
    }, {
        name: 8,
        value: 8,
        label: "8 button",
        operation:"setValue"
    }, {
        name: 9,
        value: 9,
        label: "9 button",
        operation:"setValue"
    }, {
        name: 'x',
        value: "*",
        label: 'Multiplication button',
        operation:"setSign"
    }],
    [{
        name: 4,
        value: 4,
        label: "4 button",
        operation:"setValue"
    }, {
        name: 5,
        value: 5,
        label: "5 button",
        operation:"setValue"
    }, {
        name: 6,
        value: 6,
        label: "6 button",
        operation:"setValue"
    }, {
        name: '-',
        value: "-",
        label: 'Minus button',
        operation:"setSign"
    }],
    [{
        name: 1,
        value: 1,
        label: "1 button",
        operation:"setValue"
    }, {
        name: 2,
        value: 2,
        label: "2 button",
        operation:"setValue"
    }, {
        name: 3,
        value: 3,
        label: "3 button",
        operation:"setValue"
    }, {
        name: '+',
        value: "+",
        label: 'Plus button',
        operation:"setSign"
    }],
    [{
        name: '+/-',
        value: 'negate',
        label: "Sign button",
        operation:"negate"
    }, {
        name: 0,
        value: 0,
        label: "0 button",
        operation:"setValue"
    }, {
        name: '.',
        value: ".",
        label: 'Point button',
        operation:"setValue"
    }, {
        name: '=',
        value: '=',
        label: 'Equals',
        operation:"getResult"
    }]
];
