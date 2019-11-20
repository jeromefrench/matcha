import React from 'react';

import 'rc-slider/assets/index.css';
// import 'rc-tooltip/assets/bootstrap.css';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
// import { Range } from "rc-slider";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const wrapperStyle = { width: 400, margin: 30 };


function App() {
  	return (
    	<div className="App">

			<div className="ui inverted segment">
  				<div className="ui inverted secondary menu">
					<a href="http://localhost:8080/about-you" className="item">About you</a>
					<a href="http://localhost:8080/my-account" className="item">My account</a>
					<a href="http://localhost:8080/research" className="item">Research</a>
					<a href="http://localhost:3001/" className="item">New Research</a>
				</div>
			</div>


			<div className="ui container">


<div>
    {/* <div style={wrapperStyle}> */}
    {/*   <p>Slider with custom handle</p> */}
    {/*   <Slider min={0} max={20} defaultValue={3} handle={handle} /> */}
    {/* </div> */}
    {/* <div style={wrapperStyle}> */}
    {/*   <p>Reversed Slider with custom handle</p> */}
    {/*   <Slider min={0} max={20} reverse defaultValue={3} handle={handle} /> */}
    {/* </div> */}
    {/* <div style={wrapperStyle}> */}
    {/*   <p>Slider with fixed values</p> */}
    {/*   <Slider min={20} defaultValue={20} marks={{ 20: 20, 40: 40, 100: 100 }} step={null} /> */}
    {/* </div> */}
    <div style={wrapperStyle}>
      <p>Range with custom tooltip</p>
      <Range min={0} max={20} defaultValue={[3, 10]} tipFormatter={value => `${value}%`} />
    </div>
  </div>,











				<div className="ui special cards">
					<div className="card">
						<div className="blurring dimmable image">
							<div className="ui dimmer">
								<div className="content">
									<div className="center">
										<div className="ui inverted button">


										</div>
									</div>
								</div>
							</div>
							<img className="ui medium image" src="/photo/jean/0" alt="" />
						</div>
						<div className="content">
							<a href="/#" className="header">User login </a>
							<div className="meta">
								<span className="date">Created in Sep 2014</span>
							</div>
						</div>
						<div className="extra content">
							<a href="/#">
								<i className="users icon"></i>
								2 Members
							</a>
						</div>
					</div>

				</div>
			</div>

    	</div>
  	);
}

export default App;
