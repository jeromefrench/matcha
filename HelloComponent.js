
var React = require ("react");


const Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

Range.min = 18;
Range.max = 100;
Range.value = [30, 50]
Range.trackStyle={ backgroundColor: 'blue', height: 10 }

module.exports = Range;
