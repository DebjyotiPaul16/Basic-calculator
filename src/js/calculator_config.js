export const calculator_data = [
    [{
        name: '',
        value: 'bs',
        label: "backspace",
        operation:"clearData",
        tabindex:3
    }, {
        name: 'CE',
        value: 'ce',
        label: "Clear Entry",
        operation:"clearData",
        tabindex:4
    }, {
        name: 'C',
        value: 'c',
        label: "Clear All",
        operation:"clearData",
        tabindex:5
    }, {
        name: '&divide',
        value: '/',
        label: 'Division',
        operation:"setSign",
        tabindex:18
    }],
    [{
        name: 7,
        value: 7,
        label: "Seven",
        operation:"setValue",
        tabindex:13
    }, {
        name: 8,
        value: 8,
        label: "Eight",
        operation:"setValue",
        tabindex:14
    }, {
        name: 9,
        value: 9,
        label: "Nine",
        operation:"setValue",
        tabindex:15
    }, {
        name: "&times",
        value: "*",
        label: 'Multiplication',
        operation:"setSign",
        tabindex:19
    }],
    [{
        name: 4,
        value: 4,
        label: "Four",
        operation:"setValue",
        tabindex:10
    }, {
        name: 5,
        value: 5,
        label: "Five",
        operation:"setValue",
        tabindex:11
    }, {
        name: 6,
        value: 6,
        label: "Six",
        operation:"setValue",
        tabindex:12
    }, {
        name: '-',
        value: "-",
        label: 'Minus',
        operation:"setSign",
        tabindex:20
    }],
    [{
        name: 1,
        value: 1,
        label: "One",
        operation:"setValue",
        tabindex:7
    }, {
        name: 2,
        value: 2,
        label: "Two",
        operation:"setValue",
        tabindex:8
    }, {
        name: 3,
        value: 3,
        label: "Three",
        operation:"setValue",
        tabindex:9
    }, {
        name: '+',
        value: "+",
        label: 'Plus',
        operation:"setSign",
        tabindex:21
    }],
    [{
        name: '+/-',
        value: 'negate',
        label: "Sign",
        operation:"negate",
        tabindex:16
    }, {
        name: 0,
        value: 0,
        label: "Zero",
        operation:"setValue",
        tabindex:6
    }, {
        name: '<strong>.</strong>',
        value: ".",
        label: 'decimal separator',
        operation:"setValue",
        tabindex:17
    }, {
        name: '=',
        value: '=',
        label: 'Equals',
        operation:"getResult",
        tabindex:22
    }]
];
