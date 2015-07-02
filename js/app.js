/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
'use strict';

var build_keymatrix = function(div_id, width, height) {
  var div = document.getElementById(div_id);
  var table = document.createElement("table");
  table.className = "keyboard";
  table.style.width = "100%";
  table.style.height = "100%";
  var tbody = document.createElement("tbody");

  for (var y=0 ; y<height ; y++) {
    var tr = document.createElement("tr");
    for (var x=0 ; x<width ; x++) {
      var td = document.createElement("td");
      td.textContent = x + ":" + y;
      td.style.width = "calc(100% / " + width + ")"
      td.style.maxWidth = "calc(100% / " + width + ")"
      td.style.height = "calc(100% / " + height + ")"
      td.style.maxHeight = "calc(100% / " + height + ")"
      td.addEventListener("click", pushbutton);
      tr.appendChild(td);
      if (x==0 && y==1 && div_id=="num_keys")
        td.rowSpan=3;
      if (x==0 && y==2 && div_id=="num_keys")
        td.style.display = "none";
      if (x==0 && y==3 && div_id=="num_keys")
        td.style.display = "none";
    }  
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  div.appendChild(table);
};

var delchar = function(s, n) {return s.slice(0,n) + s.slice(n+1,s.length)};
var inschar = function(s, n, c) {return s.slice(0,n) + c + s.slice(n,s.length)};

var RPN = {
  stack: [0.0,0.0,0.0,0.0],
  buffer: null,
  push:       function(val) {this.stack.pop(); this.stack.unshift(val)},
  pop:        function() {this.stack.push(this.stack[this.stack.length-1]); return this.stack.shift()},
  swap:       function() {var x=this.stack[0]; this.stack[0]=this.stack[1]; this.stack[1]=x},
  rotdn:      function() {this.stack.push(this.stack.shift())},
  rotup:      function() {this.stack.unshift(this.stack.pop())},
  add:        function() {this.push(math.add(this.pop(),this.pop()))},
  sub:        function() {this.push(math.sub(this.pop(),this.pop()))},
  mul:        function() {this.push(math.multiply(this.pop(),this.pop()))},
  div:        function() {this.swap(); this.push(math.divide(this.pop(),this.pop()))},
  neg:        function() {this.push(-this.pop())},
  recip:      function() {this.push(1.0/this.pop())},
  sin:        function() {this.push(math.sin(this.pop()))},
  cos:        function() {this.push(math.cos(this.pop()))},
  tan:        function() {this.push(math.tan(this.pop()))},
  asin:       function() {this.push(math.asin(this.pop()))},
  acos:       function() {this.push(math.acos(this.pop()))},
  atan:       function() {this.push(math.atan(this.pop()))},
  exp:        function() {this.push(math.exp(this.pop()))},
  ln:         function() {this.push(math.log(this.pop()))},
  exp10:      function() {this.push(math.pow(10,this.pop()))},
  log:        function() {this.push(math.log10(this.pop()))},
  sqrt:       function() {this.push(math.sqrt(this.pop()))},
  pow:        function() {this.swap(); this.push(math.pow(this.pop(), this.pop()))},
  pi:         function() {this.push(math.PI)},
  sqrt:       function() {this.push(math.sqrt(this.pop()))},
  rad:        function() {this.push(math.multiply(2, math.multiply(math.PI, math.divide(this.pop(), 360))))},
  deg:        function() {this.push(math.multiply(360, math.divide(this.pop(),math.multiply(2, math.PI))))},
  append:     function(c) {
    if (!this.buffer) this.buffer = "";
    switch (c) {
      case "±":
        if (!this.buffer) {
          this.neg();
        } else {
          var epos = this.buffer.indexOf("E");
          if (this.buffer[epos+1]=="-") {
             this.buffer = delchar(this.buffer, epos+1);
          } else {
              this.buffer = inschar(this.buffer, epos+1, "-");
          }
        }
        break;
      case "E":
        if (this.buffer.indexOf("E") == -1) this.buffer += "E";
        break;
      case ".":
        if (this.buffer.indexOf(".") == -1) this.buffer += ".";
        break;
      default:
        this.buffer += c;
    }
  },
  del:        function() {
    if (this.buffer) {
      this.buffer = this.buffer.substring(0, this.buffer.length-1);
    } else {
      this.pop();
    }
  },
  clr:        function() {
    if (this.buffer) {
      this.buffer = "";
    } else {
      this.pop();
    }
  },
  bufferval:  function() {return parseFloat(this.buffer)},
  dump: function() {
    if (this.buffer) {
      var bv = this.bufferval();
      this.push(bv);
      this.buffer = "";
    }
  },
  enter: function() {
    if (this.buffer) {
      this.dump();
    } else {
      this.push(this.stack[0]);
    }    
  },
  fmt: function(stack_id) {
    return math.format(RPN.stack[stack_id], {precision: 14}).replace("e","E");
  }
}

var setinv = function() {
  
}

var setnorm = function() {
  
}

var keymap = [
  {label:"0",   pad:"num_keys",  pos:[1,3], call:RPN.append},
  {label:"1",   pad:"num_keys",  pos:[1,2], call:RPN.append},
  {label:"2",   pad:"num_keys",  pos:[2,2], call:RPN.append},
  {label:"3",   pad:"num_keys",  pos:[3,2], call:RPN.append},
  {label:"4",   pad:"num_keys",  pos:[1,1], call:RPN.append},
  {label:"5",   pad:"num_keys",  pos:[2,1], call:RPN.append},
  {label:"6",   pad:"num_keys",  pos:[3,1], call:RPN.append},
  {label:"7",   pad:"num_keys",  pos:[1,0], call:RPN.append},
  {label:"8",   pad:"num_keys",  pos:[2,0], call:RPN.append},
  {label:"9",   pad:"num_keys",  pos:[3,0], call:RPN.append},
  {label:"+",   pad:"num_keys",  pos:[4,3], call:RPN.add,   dump:true},
  {label:"−",   pad:"num_keys",  pos:[4,2], call:RPN.sub,   dump:true},
  {label:"×",   pad:"num_keys",  pos:[4,1], call:RPN.mul,   dump:true},
  {label:"÷",   pad:"num_keys",  pos:[4,0], call:RPN.div,   dump:true},
  {label:"E",   pad:"num_keys",  pos:[0,0], call:RPN.append},
  {label:"±",   pad:"num_keys",  pos:[3,3], call:RPN.append},
  {label:".",   pad:"num_keys",  pos:[2,3], call:RPN.append},
  {label:"↵",   pad:"num_keys",  pos:[0,1], call:RPN.enter, rowspan:3}, // rowspan currently hardcoded
  {label:"SIN", pad:"func_keys", pos:[0,2], call:RPN.sin,   dump:true},
  {label:"COS", pad:"func_keys", pos:[1,2], call:RPN.cos,   dump:true},
  {label:"TAN", pad:"func_keys", pos:[2,2], call:RPN.tan,   dump:true},
  {label:"√x",  pad:"func_keys", pos:[3,3], call:RPN.sqrt,  dump:true},
  {label:"1/x", pad:"func_keys", pos:[4,3], call:RPN.recip, dump:true},
  {label:"eˣ",  pad:"func_keys", pos:[0,3], call:RPN.exp,   dump:true},
  {label:"10ˣ", pad:"func_keys", pos:[1,3], call:RPN.exp10, dump:true},
  {label:'yˣ',  pad:"func_keys", pos:[2,3], call:RPN.pow,   dump:true},
  {label:"R↓",  pad:"func_keys", pos:[1,0], call:RPN.rotdn, dump:true},
  {label:'C',   pad:"func_keys", pos:[3,0], call:RPN.clr},
  {label:"⌫",   pad:"func_keys", pos:[4,0], call:RPN.del},
  {label:"π",   pad:"func_keys", pos:[3,2], call:RPN.pi,    dump:true},
  {label:"x↔︎y", pad:"func_keys", pos:[2,0], call:RPN.swap,  dump:true},
  {label:"RAD", pad:"func_keys", pos:[4,2], call:RPN.rad,   dump:true},
  {label:"INV", pad:"func_keys", pos:[0,0], call:setinv},
];

var inv_keymap = [
  {label:"ASIN", pad:"func_keys", pos:[0,2], call:RPN.asin,   dump:true},
  {label:"ACOS", pad:"func_keys", pos:[1,2], call:RPN.acos,   dump:true},
  {label:"ATAN", pad:"func_keys", pos:[2,2], call:RPN.atan,   dump:true},
  {label:"x²",   pad:"func_keys", pos:[3,3], call:RPN.sqare,  dump:true},
  {label:"ln",   pad:"func_keys", pos:[0,3], call:RPN.ln,     dump:true},
  {label:"log",  pad:"func_keys", pos:[1,3], call:RPN.log,    dump:true},
  {label:'ˣ√y',  pad:"func_keys", pos:[2,3], call:RPN.xsqrt,  dump:true},
  {label:"R↑",   pad:"func_keys", pos:[1,0], call:RPN.rotup,  dump:true},
//  {label:'CLx',    pad:"func_keys", pos:[3,0], call:RPN.clx}, //TODO
//  {label:"UNDO",   pad:"func_keys", pos:[4,0], call:RPN.undo}, //TODO
//  {label:"e",      pad:"func_keys", pos:[3,2], call:RPN.pi,    dump:true}, // TODO
  {label:"x↔︎y",  pad:"func_keys", pos:[2,0], call:RPN.swap,   dump:true},
  {label:"DEG",  pad:"func_keys", pos:[4,2], call:RPN.deg,    dump:true},
  {label:"INV",  pad:"func_keys", pos:[0,0], call:setnorm},
];
  
var key_td = function (keypad, x, y) {
  var tbody = document.getElementById(keypad).firstChild.firstChild;
  return tbody.children[y].children[x];
}

var find_key = function(label) {
  for (var i=0 ; i<keymap.length ; i++) {
    if (keymap[i].label == label) return keymap[i];
  }
}

var update_display = function() {
  var display = document.getElementById("display");
  var lines = display.children;
  if (RPN.buffer) {
    lines[0].textContent = "B " + RPN.fmt(2);
    lines[1].textContent = "A " + RPN.fmt(1);
    lines[2].textContent = "Y " + RPN.fmt(0);
    lines[3].textContent = "X " + RPN.buffer + "◀"; // ◄ ◀
  } else {
    lines[0].textContent = "B " + RPN.fmt(3);
    lines[1].textContent = "A " + RPN.fmt(2);
    lines[2].textContent = "Y " + RPN.fmt(1);
    lines[3].textContent = "X " + RPN.fmt(0);
  }
  display.scrollTop = display.scrollHeight;  // make div scroll to bottom
};

var pushbutton = function(e) {
  //console.log(e);
  var td = e.target.closest('table.keyboard td');
  if (td) {
    navigator.vibrate( [60] );
    //console.log(td);
    var key = find_key(td.textContent);
    console.log("calling", key.call, "with arg", key.label);
    if (key.dump) RPN.dump.bind(RPN)();
    if (key.call) key.call.bind(RPN, key.label)();
    console.log("result: ", RPN.stack, RPN.buffer);
    update_display();
  }
}

var init = function() {
  console.log("READY.");
  build_keymatrix("func_keys", 5, 4);
  build_keymatrix("num_keys", 5, 4);
  for (var i=0; i<keymap.length ; i++) {
    var k = keymap[i];
    key_td(k.pad, k.pos[0], k.pos[1]).textContent = k.label;
  }
  //document.addEventListener("ontouchstart", pushbutton);
  update_display();
};

window.addEventListener('load', function load(evt) {
  window.removeEventListener('load', load);
  init();
});

})();