import { useState } from 'react';
import { useEffect } from 'react';
import React, { useRef } from 'react';
import './cookie.css'
const mus = require("./music/leva-eternity.mp3") 
const bgcook=require("./pics/background.png")
const cookie1 = require('./pics/cookie1.png')
const cookie2 = require('./pics/cookie2.png')
const cookie3=require('./pics/cookie3.png')
const cookie4 = require('./pics/cookie4.png')
const cookie = [
  { pic: cookie1, name: "Crumbled Cookie" },
  { pic: cookie2, name: "Cutey" },
  {pic: cookie3,name: "Alt-Ctrl-Cookie"},
  {pic: cookie4,name: "lovely"}
];

function Cookie(){
    const [count,newCount] = useState(0)
    const [lvl,newLvl] = useState(1)
    const [auto_lvl,newAuto_Lvl]=useState(1)
    const [cost_upgrade,newCost_Upgrade] = useState(35)
    const [amount,newAmount] = useState(1)
    const [cost_auto,newCost_Auto] = useState(100);
    const [auto,newAuto] = useState(false);
    const [auto_count,newAuto_Count] = useState(1);
    const isresetting = useRef(false);
    function handleclick(){
        newCount(count+amount);
    }
    function isacceptable(cookies,cost){
        if(cookies < cost){
         alert("You don't have enough cookies");
         return false
        }else
            return true
    }
    function purchase_lvl(){
        if(isacceptable(count,cost_upgrade)){
            if(lvl < cookie.length){
        newLvl(lvl+1);
        newCount(count-cost_upgrade);
        newAmount(amount+1);
        newCost_Upgrade(cost_upgrade*4);
    }else
        alert("Level Max Reached")
}
}
function purchase_auto(){
     if(isacceptable(count,cost_auto)){
        newCount(count-cost_auto);
        newAuto(true);
        newCost_Auto(cost_auto*5)
     }
}
function upgrade_auto(){
if(isacceptable(count,cost_auto)){
    if(auto_lvl < 10){
    newAuto_Lvl(auto_lvl+1)
    newAuto_Count(auto_count+1)
    newCount(count - cost_auto)
    newCost_Auto(Math.ceil(cost_auto*1.5))
}
}
}
useEffect(() => {
    if (auto) {
        const interval = setInterval(() => {
            newCount(prev => prev + auto_count);
        }, 5000);
        return () => clearInterval(interval);
    }
}, [auto,auto_count]);
useEffect(() => {
  // Load saved data when component mounts
  const savedCount = localStorage.getItem("count");
  const savedLvl = localStorage.getItem("lvl");
  const savedAutoLvl = localStorage.getItem("auto_lvl");
  const savedAuto = localStorage.getItem("auto");
  const savedCostUpgrade = localStorage.getItem("cost_upgrade")
  const savedCostAuto = localStorage.getItem("cost_auto")
  const savedAmount = localStorage.getItem("amount")
  const savedAutoCount = localStorage.getItem("auto_count")

  if (savedCount) newCount(parseInt(savedCount));
  if (savedLvl) newLvl(parseInt(savedLvl));
  if (savedAutoLvl) newAuto_Lvl(parseInt(savedAutoLvl));
  if (savedAuto) newAuto(savedAuto === "true");
  if (savedCostUpgrade) newCost_Upgrade(parseInt(savedCostUpgrade));
  if(savedCostAuto) newCost_Auto(parseInt(savedCostAuto));
  if(savedAmount) newAmount(parseInt(savedAmount));
  if(savedAutoCount) newAuto_Count(parseInt(savedAutoCount));
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    if(!isresetting.current){
    localStorage.setItem("count", count);
    localStorage.setItem("lvl", lvl);
    localStorage.setItem("auto_lvl", auto_lvl);
    localStorage.setItem("auto", auto);
    localStorage.setItem("cost_upgrade",cost_upgrade);
    localStorage.setItem("cost_auto",cost_auto)
    localStorage.setItem("amount",amount)
    localStorage.setItem("auto_count",auto_count)
  }}, 1000);
  return () => clearInterval(interval);
}, [count, lvl, auto_lvl, auto,cost_upgrade,cost_auto,amount,auto_count]);
 const audioRef = useRef(null);

  const playMusic = () => {
    audioRef.current.play();
    document.querySelector('.music-play').style.boxShadow = 'none';
    document.querySelector('.music-pause').style.boxShadow= '2px 5px 1px rgba(0, 0, 0, 0.3)';

  };

  const pauseMusic = () => {
    audioRef.current.pause();
     document.querySelector('.music-pause').style.boxShadow = 'none';
    document.querySelector('.music-play').style.boxShadow= '2px 5px 1px rgba(0, 0, 0, 0.3)';
  };
  const reset = ()=>{
    const confirm = window.confirm("Are you sure you want to reset?")
    if (confirm) {
        isresetting.current=true;
  localStorage.clear();
  window.location.reload();
}
  }
        return(
        <div className='container' style={{backgroundImage: `url(${bgcook})`}}>
            <button className='btn' onClick={reset}>Reset Data</button>
        <h1>Current level {lvl}</h1>
        <h2>Number of cookies: {count}</h2>
        <h3>Name: {cookie[lvl-1].name}</h3> 
        <img src={cookie[lvl-1].pic} className="cookie" alt="img" onClick={handleclick} /><br />
        <button className='btn' onClick={lvl<cookie.length?()=>purchase_lvl():()=>""}>{lvl<cookie.length?"Upgrade for level ("+(lvl+1) + ") " + cost_upgrade +" cookies":"level max reached"}</button> 
        <button className='btn' onClick={!auto? ()=>purchase_auto(auto):auto_lvl<10 ? ()=> upgrade_auto():()=>""}>{auto_lvl===10?"Max level reached":auto? 'Upgrade auto clicker to lvl ('+(auto_lvl+1)+") for "+ cost_auto +" Cookies":'Get Auto Clicker ' +cost_auto+ ' cookies'} </button>
        <audio ref={audioRef} src={mus} />
              <button className='music-play' onClick={playMusic}>Play Music</button>
              <button className='music-pause'onClick={pauseMusic}>Pause Music</button>
        </div>
    );
}   
export default Cookie;