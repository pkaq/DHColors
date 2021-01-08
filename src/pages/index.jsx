/* eslint-disable no-script-url,react/jsx-no-target-blank */
import React from 'react';
import Interactive from 'react-interactive';
import Color from 'color';
import { Progress } from 'antd';

import './static/style';
import jsonData from './colors';

function getX(current, num) {
  let x = (current % num) - 1;
  x = x < 0 ? num - 1 : x;
  return x;
}

function getY(current, num) {
  let y = current / num;
  y = current % num === 0 ? y - 1 : Math.floor(y);
  return y;
}

export default class index extends React.Component {

  state = {
    colorTitle: '',
    colorUrl: '',
    rubyTitle: '',
    currentItem: {},
    currentInfo: {},
    isMunsell: false,
    perspective: 100,
  };

  componentWillMount() {
    this.setRandomItem();
  }

  setRandomItem = () => {
    let randomNum = Math.random();
    randomNum = Math.round(randomNum * 36);
    const item = jsonData[randomNum];
    const color = Color(`#${item.color}`);
    const cmyk = color.cmyk().round().array();
    const rgb = color.rgb().array();

    const url = require(`@/assets/images/title_${item.id}.png`);

    this.setState({
      colorTitle: item.cname,
      colorUrl: url,
      rubyTitle: item.name,
      currentItem: item,
      currentInfo: {
        cmyk,
        rgb,
      },
    });
  };

  handleClick = (item) => {
    const color = Color(`#${item.color}`);
    const cmyk = color.cmyk().round().array();
    const rgb = color.rgb().array();

    this.setState({
      currentItem: item,
      currentInfo: {
        cmyk,
        rgb,
      },
    });

    let anitype = "out";

    let ct =  document.getElementById('colorTitle');
    let cr =  document.getElementById('colorRuby');

    cr.className = "fadeOut";
    ct.className = "altText fadeOut";
    anitype = "out";

    ct.addEventListener('webkitAnimationEnd', () => {
      if("out" === anitype) {
        const url = require(`@/assets/images/title_${item.id}.png`);
        this.setState({
          colorTitle: item.cname,
          colorUrl: url,
          rubyTitle: item.name
        })
        ct.className = "altText fadeIn";
        cr.className = "fadeIn";

        anitype = "in";
      }
    })

  };

  switchMunsell = () => {
    const { isMunsell, currentItem } = this.state;
    const newStatus = !isMunsell;

    this.setState({
      isMunsell: newStatus,
    });

    document.getElementById('body').className = newStatus ? 'munsell' : '';

    if (newStatus) {
      this.interval = setInterval(() =>{
        this.setRandomItem();
        const ranges = [0, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900];
        const perspective = ranges[Math.floor(Math.random() * 14)];
        this.setState({
          perspective,
        })
      }, 4000);
    } else {
      clearInterval(this.interval);
    }
  };

  render() {
    const { currentItem, isMunsell, perspective,
      colorTitle,
      colorUrl,
      rubyTitle,
      currentInfo: {
        cmyk, rgb,
      },
    } = this.state;

    const colList = jsonData.map((item, i) => {
      const j = i + 1;
      return (<li
        id={`col${item.id}`} key={item.id}
        style={{
          left: isMunsell ? '' : (66 * getX(j, 7)) + 10,
          top: isMunsell ? '' : 40 + (getY(j, 7) * 302),
          backgroundPosition: `${getX(j, 10) * (-50)}px ${getY(j, 10) * (-40)}px`,
        }}
      >
        <div key={`${item.id}-div`}>
          <Interactive
            as="a"
            key={`${item.id}-a`}
            normal={{ WebkitMaskPosition: isMunsell ? '' : `${getX(j, 20) * (-50)}px ${getY(j, 20) * (-278)}px` }}
            hover={{
              backgroundColor: `#${item.color}`,
              WebkitMaskPosition: `${getX(j, 20) * (-50)}px ${getY(j, 20) * (-278)}px`,
            }}
            active="hover"
            onClick={() => this.handleClick(item)}
          >
            {item.cname}, {item.name.toUpperCase()}
          </Interactive>
        </div>
      </li>);
    });

    return [
      <div id="mask" />,
      <div id={'bgWrap'} style={{ backgroundColor: `#${currentItem.color}` }}>
        <div id="gloss" />
      </div>,
      <div id="container">
        <header id="logo">
          <h1 className="altText">DunHuang COLORS</h1>
        </header>

    {/*
      <aside id="controller">
          <div id="switch">
            <div
              className="iphone_switch_container"
              style={{ height: 23, width: 74, position: 'relative', overflow: 'hidden' }}
              onClick={this.switchMunsell}
            >
              <img
                className="iphone_switch"
                style={{
                  height: 23,
                  width: 74,
                  backgroundImage: `url(${iphoneSwitch})`,
                  backgroundPosition: isMunsell ? '0px center' : -35,
                }}
                src={iphoneSwitchContainer}
                role="presentation"
              />
            </div>
          </div>
        </aside>
    */}
        <article id="data">
          <header>
            <h2>
              <span
                id="colorTitle"
                className="altText"
                style={{
                  display: 'block',
                  maxHeight: 330,
                  maxWidth: 950,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${colorUrl})`,
                }}
              >
                {colorTitle}
              </span>

              <span id="colorRuby" className="fadeOut">
                {rubyTitle.toUpperCase()}
              </span>

            </h2>
          </header>

          <div id="colorBox" className={isMunsell ? 'munsell' : ''}>
            <dl id="CMYKcolor">
              {['c', 'm', 'y', 'k'].map((item, index) => {
                return (
                  <div id={item}>
                    <dt className={`${item} altText`}>{item.toUpperCase()}</dt>
                    <dd>
                      <Progress width={38} type={'circle'} strokeColor={'#f00'} percent={cmyk[index]} format={percent => percent} />
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div id="RGBcolor">
              <dl>
                {['r', 'g', 'b'].map((item, index) => {
                  return (<div>
                    <dt className={`${item} altText`}>{item.toUpperCase()}</dt>
                    <dd className={item}><span>{rgb[index]}</span></dd>
                  </div>);
                })}
              </dl>
              <div id="RGBvalue"><input type="text" value="#90B44B" readOnly="readonly" /></div>
            </div>
          </div>
        </article>

        <nav id="colorContainer" style={{WebkitPerspective: isMunsell ? perspective:'',perspective: isMunsell ? perspective:''}}>
          <ul id="colors">
            {colList}
          </ul>
        </nav>

        <footer>
          <div className="cont">
            <p id="copy">Copyright © 2020 PKAQ. Some Rights Reserved.Shanzhai to Nipponcolors.</p>
          </div>
        </footer>
      </div>,
    ];indexedDB
  }
}

