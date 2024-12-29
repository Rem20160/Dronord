function formatAndConvertNumber(value) {
    const num = OmegaNum(value); 
    const isNegative = num.lt(0); 
    const absNum = num.abs(); 
    const thresholds = [
        { value: '1e45', suffix: 'De kg' }, // Decillion kg
        { value: '1e42', suffix: 'No kg' }, // Nonillion kg
        { value: '1e39', suffix: 'Oc kg' }, // Octillion kg
        { value: '1e36', suffix: 'Sp kg' }, // Septillion kg
        { value: '1e33', suffix: 'Sx kg' }, // Sextillion kg
        { value: '1e30', suffix: 'Qt kg' }, // Quintillion kg
        { value: '1e27', suffix: 'Qa kg' }, // Quadrillion kg
        { value: '1e24', suffix: 'T kg' },  // Trillion kg
        { value: '1e21', suffix: 'B kg' },  // Billion kg
        { value: '1e18', suffix: 'M kg' },  // Million kg
        { value: '1e15', suffix: 'kg' },    // Kilograms
        { value: '1e12', suffix: 'g' },     // Grams
        { value: '1e9', suffix: 'mg' },     // Milligrams
        { value: '1e6', suffix: 'µg' },     // Micrograms
        { value: '1e3', suffix: 'ng' },     // Nanograms 
        { value: '1', suffix: 'pg' },       // Picograms 
    ];

    if (absNum.gte('1e48')) {
        return `${isNegative ? '-' : ''}${absNum.toExponential(1)} kg`;
    }

    for (const threshold of thresholds) {
        if (absNum.gte(threshold.value)) {
            let formattedValue = absNum.div(threshold.value);
            if (formattedValue.lt(10)) {
                formattedValue = formattedValue.toFixed(1); 
            } else {
                formattedValue = formattedValue.toFixed(0); 
            }
            return `${isNegative ? '-' : ''}${formattedValue} ${threshold.suffix}`;
        }
    }

    let picogramValue = absNum.toNumber(); 
    if (picogramValue < 10) {
        return `${isNegative ? '-' : ''}${picogramValue.toFixed(3)} pg`; 
    } else {
        return `${isNegative ? '-' : ''}${picogramValue.toFixed(0)} pg`; 
    }
}








function formatNumber(value) {
    const num = new OmegaNum(value); 
    const thresholds = [
        { value: new OmegaNum('1e33'), suffix: 'De' },
        { value: new OmegaNum('1e30'), suffix: 'No' },
        { value: new OmegaNum('1e27'), suffix: 'Oc' },
        { value: new OmegaNum('1e24'), suffix: 'Sp' },
        { value: new OmegaNum('1e21'), suffix: 'Sx' },
        { value: new OmegaNum('1e18'), suffix: 'Qt' },
        { value: new OmegaNum('1e15'), suffix: 'Qa' },
        { value: new OmegaNum('1e12'), suffix: 'T' },
        { value: new OmegaNum('1e9'), suffix: 'B' },
        { value: new OmegaNum('1e6'), suffix: 'M' },
    ];
    if (num.gte(new OmegaNum('1e36'))) {
        return `${num.toExponential(1)}`; 
    }
    for (const threshold of thresholds) {
        if (num.gte(threshold.value)) {
            let formattedValue = num.div(threshold.value);
            if (formattedValue.gte(10)) {
                return `${formattedValue.toFixed(0)} ${threshold.suffix}`; 
            } else {
                return `${formattedValue.toFixed(1)} ${threshold.suffix}`; 
            }
        }
    }
    if (num.eq(0)) {
    return "0"; }
    else if (num.lt(1)) {
        return `${num.toFixed(3)}`; 
    } else if (num.lt(10)) {
        return num.isInteger() ? `${num.toFixed(0)}` : `${num.toFixed(3)}`; 
    } else {
        return `${num.toFixed(0)}`; 
    }
}



function formatResearch(value) {
    const num = new OmegaNum(value); 
    const thresholds = [
        { value: new OmegaNum('9671406556917033397649408'), suffix: 'YB' },
        { value: new OmegaNum('9444732965739290427392'), suffix: 'ZB' },
        { value: new OmegaNum('9223372036854775808'), suffix: 'EB' },
        { value: new OmegaNum('9007199254740992'), suffix: 'PB' },
        { value: new OmegaNum('8796093022208'), suffix: 'TB' },
        { value: new OmegaNum('8589934592'), suffix: 'GB' },
        { value: new OmegaNum('8388608'), suffix: 'MB' },
        { value: new OmegaNum('8192'), suffix: 'KB' },
        { value: new OmegaNum('8'), suffix: 'Bytes' },
        { value: new OmegaNum('1'), suffix: 'bits' },
    ];

    for (const threshold of thresholds) {
        if (num.gte(threshold.value)) {
            let formattedValue = num.div(threshold.value);
            if (formattedValue.gte(1024)) {
                return `${formattedValue.toFixed(0)} ${threshold.suffix}`; 
            } else {
                return `${formattedValue.toFixed(1)} ${threshold.suffix}`; 
            }
        }
    }

    if (num.eq(0)) {
    return "0 bits"; }
    else if (num.lt(1)) {
        return `${num.toFixed(3)} bits`; 
    } else if (num.lt(10)) {
        return num.isInteger() ? `${num.toFixed(0)}` : `${num.toFixed(3)}`; 
    } else {
        return `${num.toFixed(0)}`; 
    }
}