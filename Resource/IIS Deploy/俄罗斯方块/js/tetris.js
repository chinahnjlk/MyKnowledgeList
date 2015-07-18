/**
 * Created by Chvin on 15/2/3.
 */

;(function(){
    //tetris集合
    var tetris = {
        //初始化
        init : function(){
            var _this = this;
            this.cache = [];
            this.b = (function(){
               var b = [];
               var p = id("matrix").getElementsByTagName("p");
               for(var i = 0,len1 = p.length;i<len1;i++){
                   b[i] = [];
                   _this.cache[i] = [];
                   for(var n = 0,len2=p[i].children.length;n<len2;n++){
                       b[i].push(p[i].children[n]);
                       _this.cache[i].push(0);
                   }
               }
               return b;
            }());
            this.elm = {};
            this.elm.wrap = id("wrap");
            this.elm.pause = id("pause");
            this.elm.sounds = id("sounds");
            this.elm.scores = id("scores");
            this.elm.lines = id("lines");
            this.elm.level = id("level");
            this.elm.next = id("next");
            this.elm.rank = id("rank");
            this.elm.w = {};
            this.elm.w.scores = id("w_scores");
            this.elm.w.lines = id("w_lines");
            this.elm.btn = {};

            this.elm.btn.rotate = {
               elm : id("rotate"),
               style_on : '-200px 0',
               style_off : '0 0'
            };

            this.elm.btn.fall = {
                elm : id("b_up"),
                style_on : '-200px -300px',
                style_off : '0 -300px'
            };

            this.elm.btn.left = {
                elm : id("b_left"),
                style_on : '-200px -300px',
                style_off : '0 -300px'
            };

            this.elm.btn.right = {
                elm : id("b_right"),
                style_on : '-200px -300px',
                style_off : '0 -300px'
            };

            this.elm.btn.drop = {
                elm : id("b_bottom"),
                style_on : '-200px -300px',
                style_off : '0 -300px'
            };

            this.elm.btn.pause = {
                elm : id("b_pause"),
                style_on : '-300px -200px',
                style_off : '-200px -200px'
            };

            this.elm.btn.reset = {
                elm : id("b_reset"),
                style_on : '-100px -200px',
                style_off : '0 -200px'
            };

            this.elm.btn.sounds = {
                elm : id("b_sounds"),
                style_on : '-300px -200px',
                style_off : '-200px -200px'
            };

            this.elm.btn.rank = {
                elm : id("b_rank"),
                style_on : '-300px -200px',
                style_off : '-200px -200px'
            };

            var btn = this.elm.btn;

            for(var i in btn){
                if(!btn.hasOwnProperty(i)){
                    continue;
                }
                (function(i){
                    if(document.addEventListener){
                        btn[i].elm.addEventListener("touchstart",function(){
                            this.style.backgroundPosition = btn[i].style_on;
                            if(!_this.lock){
                                control[i].on({m:"touch"});
                            }
                        },true);
                        btn[i].elm.addEventListener("touchend",function(){
                            this.style.backgroundPosition = btn[i].style_off;
                            if(!_this.lock){
                                control[i].off();
                            }
                        },true);
                    }
                }(i));
            }
            if(document.addEventListener){
                document.addEventListener("keydown",keydown,true);
                document.addEventListener("keyup",keyup,true);
                id("main").addEventListener("touchstart",function(event){
                    if(event.preventDefault){
                        event.preventDefault();
                    }
                },true);
            }else if(document.attachEvent){
                document.attachEvent("onkeydown",keydown);
                document.attachEvent("onkeyup",keyup);
            }

            sounds_resource.init();
            this.next = parseInt(Math.random()*7);
            this.high_scores = this.get_high_scores();
            this.status_show();
            this.logo.init();
            this.size();
            this.push();

            (function(){//时间输出
                var time = id("time").getElementsByTagName("span"),
                    len = time.length;
                (function(){
                    var d = new Date(),
                        mini = d.getMinutes(),
                        hours = d.getHours(),
                        colon = d.getSeconds()%2?["d"]:["d_c"],
                        ar = arguments;
                    mini = mini<10?[0,mini]:mini.toString().split("");
                    hours = hours<10?["n",hours]:hours.toString().split("");
                    var w = hours.concat(colon).concat(mini);
                    for(var i= 0;i<len;i++){
                        time[i].className = "s_"+w[i];
                    }
                    t(function(){ar.callee();},1000);
                }());
            }());

            (function(){//暂停状态输出
                _this.elm.pause.className = "";
                var ar = arguments;
                t(function(){
                    if(_this.pause){
                        _this.elm.pause.className = "c";
                    }
                    t(function(){
                        ar.callee();
                    },250);
                },250);
            }());

        },

        //响应式自适应
        size : function(){
            var wrap = this.elm.wrap,
                load = id("load"),
                control = id("control"),
                tran = (function(){
                    var trans = ["webkitTransform","transform","msTransform","mozTransform","oTransform"],
                        tran = "",
                        body = document.body;
                    for(var i= 0,len=trans.length;i<len;i++){
                        if(body.style[trans[i]] !== undefined){
                            tran = trans[i];
                            break;
                        }
                    }
                    return tran;
                }());

            load.style.display = "none";
            wrap.style.top = "50%";
            scale();
           window.onresize = function(){
                scale();
            };

            function scale(){
                var state = win();
                if(tran){
                    var _scale;
                    if(state.scale<1.5){
                        _scale = state.h/960;
                        wrap.style[tran] = "scale("+_scale+")";
                        wrap.style.padding = "0";
                        wrap.style.marginTop = "-480px";
                        control.style.padding = "0";
                    }else{
                        _scale = state.w/640;
                        var p = (state.h - 960*_scale)/_scale/3;
                        wrap.style[tran] = "scale("+state.w/640+")";
                        wrap.style.padding = parseInt(p)+"px 0";
                        wrap.style.marginTop = parseInt(-480-p*3/2)+"px";
                        control.style.padding = parseInt(p)+"px 0 0";
                    }
                }else{
                    wrap.style.position = "relative";
                    wrap.style.marginTop = "0";
                    wrap.style.top = "0";
                    document.body.style.overflow = "visible";
                }

            }
        },

        //游戏状态
        run : false,

        //是否暂停
        pause : false,

        //是否开启音效
        sounds : true,

        //是否锁定
        lock : true,

        //起始级别
        level_start : 1,

        //速度
        speed : [1000,800,650,550,450,350,250,150,120],

        //得分
        scores : 0,

        //消除行
        lines_clear : 0,

        //起始行
        lines_start : 0,

        //建造起始行
        build_lines : function(){
            var _this = this,
                start = this.lines_start;
            if(!start){
                return;
            }
            var init = [];

            for(var i=0;i<start;i++){
                if(i<=3){
                    init.push(d(5,8));
                }else if(i<=6){
                    init.push(d(4,9));
                }else if(i<=9){
                    init.push(d(3,9));
                }
            }

            for_for(init,function(e,i){
                _this.cache[19-i][e] = 1;
            });

            function d(min,max){//返回length范围在min~max的，元素是0~9的随机数组
                var arr = [0,1,2,3,4,5,6,7,8,9],
                    need = parseInt((max-min+1)*Math.random()+min),//返回 min~max的数字（包括边界）
                    result = [];
                for(var i= 0;i<need;i++){
                    result.push(arr.splice(parseInt(arr.length*Math.random()),1)[0]);
                }
                return result.sort(function(a,b){return a-b;});
            }
        },

        //内存增
        cache_insert : function(){
            for(var i= 0,len=arguments.length;i<len;i++){
                if(arguments[i][0]<0) continue;//处理初始时rotate
                this.cache[arguments[i][0]][arguments[i][1]] = 1;
            }
        },

        //内存减
        cache_delete : function(){
            for(var i= 0,len=arguments.length;i<len;i++){
                if(arguments[i][0]<0) continue;//处理初始时rotate
                this.cache[arguments[i][0]][arguments[i][1]] = 0;
            }
        },

        //读取积分榜
        get_high_scores : function(){
            var h_c;
            if(window.localStorage){//storage
                h_c = window.localStorage.TETRIS_HIGH_SCORES;
            }else{
                h_c = getCookie('TETRIS_HIGH_SCORES');
            }
            try {
                if(h_c){
                    h_c = JSON.parse(h_c);
                }else{
                    h_c = [];
                }
            } catch (e) {
                error();
                h_c =  [];
            } finally{
                if(!is_array(h_c)){
                    error();
                    h_c = [];
                }
                for(var i= 0,len=h_c.length;i<len;i++){
                    if(!is_array(h_c[i])){
                        h_c = [];
                    }
                    if(h_c[i].length !== 2){
                        h_c = [];
                    }
                    if(isNaN(h_c[i][1]+0)){
                        h_c = [];
                    }
                }
            }

            return h_c;

            function error(){//错误重置
                alert("数据读取错误，积分榜将重置。");
                if(window.localStorage){
                    window.localStorage.TETRIS_HIGH_SCORES = undefined;
                }else{
                    setCookie('TETRIS_HIGH_SCORES',"");
                }
            }

        },

        //开始游戏
        start : function(){
            this.high_scores = this.get_high_scores();
            this.logo.stop();
            this.run = true;
            this.level = this.level_start;
            this.lines_clear = 0;
            this.scores = 0;
            this.build_lines();
            this.round();
        },

        //判断是否进入积分榜，返回排名
        is_submit : function(){
            var _this = this;
            if(this.scores === 0){
                return 0;
            }
            if(this.high_scores.length === 0){
                return 1;
            }
            var rk = 1;
            for_for(this.high_scores,function(e,i,n){
                if(n === 0){
                    return;
                }
                if(e>=_this.scores){
                    rk++;
                }
            });
            rk = rk>10?0:rk;
            return rk;
        },

        //提交积分榜
        submit : function(rk,name){
            var _this = this;
            if(rk === 0){
                return;
            }
            this.high_scores.splice(rk-1,0,[name,this.scores]);
            this.high_scores = this.high_scores.slice(0,10);
            sub_display();
            function sub_display(){
                if(window.localStorage){//storage
                    window.localStorage.TETRIS_HIGH_SCORES = _this.high_scores.toJSONString();
                }else{
                   setCookie('TETRIS_HIGH_SCORES',_this.high_scores.toJSONString());
                }
            }
        },

        //logo动画模块
        logo : {
            init : function(){
                this.logo = id("logo");
                this.dragon = id("dragon");
            },
            time : null,
            play : function(){//亮出我的大名
                var _this = this,
                    logo = this.logo,
                    dragon = this.dragon,
                    count = 0;
                clearTimeout(this.time);
                var m = "r";

                dragon.className = m+1;
                s(function(){//忽隐忽现
                    h(function(){
                        s(function(){
                            h(function(){
                                s(function(){
                                    dra();
                                });
                            });
                        });
                    });
                });

                function dra(){//我是一条龙
                    count = 0;
                    eyes(function(){
                        eyes(function(){
                            eyes(function(){
                                dragon.className = m+2;
                                move(dra);
                            },150,150);
                        },150,150);
                    },1000,1500);
                }

                function move(func){//奔跑吧，巨龙！
                    set(function(){
                        dragon.className = m+4;
                        set(function(){
                            dragon.className = m+3;
                            count++;
                            if(count === 10 || count === 20 || count === 30){
                                m = m==="r"?"l":"r";
                            }
                            if(count<40){
                                move(func);
                            }else{
                                dragon.className = m+1;
                                if(func){
                                    set(function(){
                                        func();
                                    },5000);
                                }
                            }
                        },100);
                    },100);
                }

                function eyes(func,delay1,delay2){//一闪一闪亮晶晶
                    set(function(){
                        dragon.className = m+2;
                        set(function(){
                            dragon.className = m+1;
                            if(func)func();
                        },delay2);
                    },delay1);
                }

                function s(func){
                    set(function(){
                        logo.style.display = "block";
                        if(func)func();
                    },150);
                }
                function h(func){
                    set(function(){
                        logo.style.display = "none";
                        if(func)func();
                    },150);
                }

                function set(func,delay){
                    if(!func) return;
                    _this.time = t(function(){
                        func();
                    },delay);
                }
            },
            stop : function(){
                clearInterval(this.time);
                this.logo.style.display = "none";
            }
        },

        //分享
        share : function(){
            var max = 0,
                title = "";
            if(!this.high_scores){
                this.high_scores = this.get_high_scores();
            }
            if(this.high_scores.length>=1){
                max = this.high_scores[0][1];
            }
            if(max !== 0 || this.scores !== 0){
                title += "我在「俄罗斯方块」获得了" + (this.scores !== 0?this.scores:max);
                if (this.scores !== 0 && this.scores < max) {
                    title += "（最高" + max + "）";
                }
                title += "分，你也来试试！一款唤起童年经典记忆的掌上游戏。";
            }else{
                title += "俄罗斯方块，一起唤起童年的经典记忆。";
            }
            document.title = title;
        },

        //显示积分榜
        rank_show : function(index){
            var _this = this;
            if(this.run){
              this.pause = true;
            }
            this.lock = true;

            var rk = this.get_high_scores(),
                h2 = document.createElement("h2"),
                table_rk = document.createElement("table"),
                table_c = document.createElement("table"),
                c_body = document.createElement("tbody"),
                tr = document.createElement("tr"),
                rk_list = "",
                share_weixin;
            h2.innerHTML = '<span>积分榜</span>';

            rk_list += '<tbody>';

            for_for(rk,function(e,i,n){
                if(n === 0){
                    rk_list += '<tr';
                    if(i<3){
                        rk_list += ' class="L'+(i+1)+'"';
                    }
                    rk_list += '>';
                    rk_list += '<td class="num"><span'+((i===index-1 && i>=3)?' class="cur"':'')+'>'+(i+1)+'</span></td>';
                    rk_list += '<td class="name"><span title="'+this[i][0]+'"'+((i===index-1)?' class="cur"':'')+'>'+this[i][0]+'</span></td>';
                    rk_list += '<td class="score"><span'+((i===index-1)?' class="cur"':'')+'>'+this[i][1]+'</span></td>';
                    rk_list += '</tr>\n';
                }
            });
            if(rk.length === 0){
                rk_list += '<td><br>暂无<br><br></td>';
            }
            rk_list += '</tbody>';
            var temp_div = document.createElement("div");
            temp_div.innerHTML = '<table>'+rk_list+'</table>';
            var temp_tbody = temp_div.children[0].children[0];
            table_rk.appendChild(temp_tbody);//解决table无法使用innerHTML（IE）

            for(var i= 0,len = (this.is_mobile?3:2);i<len;i++){
                var td = document.createElement("td"),
                    span = document.createElement("span");

                share_weixin = document.createElement("div");
                share_weixin.className = "share_weixin";
                share_weixin.style.display = "none";
                share_weixin.onclick = function(){
                    this.style.display = "none";
                };

                (function(i){
                    switch(i){
                        case 0 :
                            span.innerHTML = "重置";
                            span.onclick = function(){
                                if(window.confirm("你确定要清空积分榜吗？")){
                                    if(window.localStorage){
                                        window.localStorage.TETRIS_HIGH_SCORES = "";
                                    }else{
                                        setCookie('TETRIS_HIGH_SCORES',"");
                                    }
                                    _this.high_scores = [];
                                    _this.scores = 0;
                                    _this.status_show();
                                    _this.rank_hide(function(){
                                        _this.rank_show();
                                    });
                                }
                            };
                            break;
                        case 1 :
                            span.className = "c";
                            span.innerHTML = "关闭";
                            span.onclick = function(){_this.rank_hide();};
                            break;
                        case 2 :
                            span.className = "c";
                            span.innerHTML = "分享";
                            span.onclick = function(){
                                share_weixin.style.display = "block";
                            };
                            break;
                    }
                }(i));
                tr.appendChild(td).appendChild(span);
            }
            table_c.className = "c";
            table_c.appendChild(c_body).appendChild(tr);

            this.elm.rank.innerHTML = "";
            this.elm.rank.appendChild(h2);
            this.elm.rank.appendChild(table_rk);
            this.elm.rank.appendChild(table_c);
            if(this.is_mobile){
                this.elm.rank.appendChild(share_weixin);
            }

            for(var n=0;n<=100;n++){
              (function(i){
                  setTimeout(function(){
                      _this.elm.rank.style.top = "-"+(100-i)+"%";
                  },i*2);
              }(n));
            }
        },

        //关闭积分榜
        rank_hide : function(func){
            var _this = this;
            for(var i=0;i<=100;i++){
                (function(i){
                    setTimeout(function(){
                        _this.elm.rank.style.top = "-"+i+"%";
                        if(i===100){
                            if(_this.run){
                                _this.pause = false;
                                _this.auto();
                            }
                            _this.lock = false;
                            if(func){
                                func();
                            }
                        }
                    },i*2);
                }(i));
            }
        },

        //洗牌
        push : function(is_submit){
            var _this = this;
            this.lock = true;
            this.run = false;
            this.pause = false;
            for_for(_this.b,function(e,i,n){
                var b = this;
                t(function(){
                    b[19-i][n].className =  "c";
                    if(i===b.length-1 && n === 9){
                        for_for(b,function(e2,i2,n2){
                            t(function(){
                                b[i2][n2].className =  "";
                                _this.cache[i2][n2] = 0;
                                if(i2===b.length-1 && n2 === 9 ){
                                    if(is_submit){//走提交流程
                                        var rk = _this.is_submit();
                                        if(rk>0){
                                            t(function(){
                                                var name = window.prompt("你获得了积分榜第"+rk+"名！请输入你的姓名：");
                                                name = ( name === "" || name === "undefined" || name === "null") ?  "匿名" : name;
                                                _this.submit(rk,name);
                                                _this.rank_show(rk);
                                                _this.status_show();
                                                _this.logo.play();
                                            },100);
                                            return;
                                        }else{
                                            _this.lock = false;
                                        }
                                    }else{
                                        _this.lock = false;
                                    }

                                    _this.status_show();
                                    _this.logo.play();
                                }
                            },(i2+1)*40);
                        });
                    }
                },i*40);
            });
        },

        //判断是否结束
        is_over : function(){
            var rt = false;
            for(var i = 0,len = this.cache[0].length;i<len;i++){
                if(this.cache[0][i]){
                    rt = true;
                    break;
                }
            }
            return rt;
        },

        //游戏结束
        over : function(){
            this.status_show();
            sounds_resource.gameover.play();
            this.push(true);//提交积分榜
        },

        //渲染
        fresh : function(){
            var _this = this;
            for_for(this.cache,function(e,i,n){
                _this.b[i][n].className = e?'c':"";
            });

            if(this.console !== true || !window.console || !window.console.table){
                return;
            }
            var w = [];
            for_for(this.cache,function(e,i,n){
                if(n===0){
                    w[i] = [];
                }
                if(e){
                    w[i][n] = 0;
                }else{
                    w[i][n] = '';
                }

            });
            console.clear();
            console.table(w);
        },

        //新block开始
        round : function(){
            this.share();
            if(this.is_over()){
                this.over();
                return;
            }
            this.block = new Block(this.next === undefined?parseInt(Math.random()*7):this.next);
            this.next = parseInt(Math.random()*7);
            this.block.fresh();
            this.block.timeStamp = new Date().getTime();
            this.auto();
            this.status_show();
        },

        //是否可消除
        is_clear : function(){
            var lines = [];
            for_for(this.cache,function(e,i,n){
                if(n === 0){
                    lines[i] = true;
                }
                if(!e){
                    lines[i] = false;
                }
            });
            return (function(){
                var rt = false;
                for(var i = 0,len=lines.length;i<len;i++){
                    if(lines[i]){
                        if(!rt){
                            rt = [];
                        }
                        rt.push(i);
                    }
                }
                return rt;
            }());
        },

        //消除
        clear : function(lines){
            var b = [],
                _this = this;
            for(var i= 0,len=lines.length;i<len;i++){
                this.cache.splice(lines[i],1);
                this.cache.unshift([]);
                for(var n= 0,len2 = tetris.b[lines[i]].length;n<len2;n++){
                    b.push(tetris.b[lines[i]][n]);
                    this.cache[0].push(0);
                }
            }
            function hide(func){
                for(var i= 0,len= b.length;i<len;i++){
                    b[i].className = "";
                }
                t(function(){
                    if(func){func();}
                },100);
            }

            function show(func){
                for(var i= 0,len= b.length;i<len;i++){
                    b[i].className = "c";
                }
                t(function(){
                    if(func){func();}
                },100);
            }

            function fresh(){
                _this.fresh();
                _this.round();
            }

            this.scores += [100,300,700,1500][lines.length-1];

            this.lines_clear += lines.length;

            var level = this.level_start + parseInt(this.lines_clear/30);
            level = level>9?9:level;
            this.level = level;

            sounds_resource.clear.play();

            hide(function(){
                show(function(){
                    hide(function(){
                        show(function(){
                            hide(function(){
                                show(function(){
                                    hide(function(){
                                        fresh();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        },

        //自动drop
        auto : function(n){
            var ar = arguments,
                _this = this;
            if (n < 0) {
                n = 0;
            }
            clearTimeout(_this.block.time);
            _this.block.time = t(function () {
                if(!_this.pause && !_this.lock){
                    _this.block.drop();
                    ar.callee.call(_this);
                }
            }, n === undefined ? _this.speed[_this.level - 1] : n);
        },

        //侧面板输出
        status_show : function(){
            var _this = this;
            next_promt(new Block(this.next).shape_cur);
            this.elm.sounds.className = this.sounds?"":"c";//声音
            var max_score = 0;
            if(this.high_scores.length>0){
                max_score = this.high_scores[0][1];
            }
            if(!this.run){
                this.elm.level.getElementsByTagName("span")[0].className = "s_"+this.level_start;//开始级别
                scores_show("最高分",max_score);
                lines_show("初始行",_this.lines_start);

                if(this.scores>0 && this.status_show_time === undefined){
                    (function(){
                        var ar = arguments;
                        _this.status_show_time = t(function(){
                            scores_show("上轮得分",_this.scores);
                            _this.status_show_time = t(function(){
                                scores_show("最高分",max_score);
                                ar.callee();
                            },3000);
                        },3000);
                    }());
                }else{
                    clearTimeout(this.status_show_time);
                }
                return;
            }

            clearTimeout(this.status_show_time);
            this.status_show_time = undefined;

            scores_show(this.scores>max_score?"最高分":"得分",this.scores);//得分

            lines_show("消除行",this.lines_clear);//消除行

            this.elm.level.getElementsByTagName("span")[0].className = "s_"+this.level;//级别




            function scores_show(w,p){
                _this.elm.w.scores.innerHTML = w;
                convert(p,_this.elm.scores.getElementsByTagName("span"));//分数
            }

            function lines_show(w,p){
                _this.elm.w.lines.innerHTML = w;
                convert(p,_this.elm.lines.getElementsByTagName("span"));//消除行
            }

            function next_promt(arr){//下一个提示
                for_for(shape_format(arr),function(e,i,n){//下一个
                    if(e){
                        _this.elm.next.children[i].children[n].className = "c";
                    }else{
                        _this.elm.next.children[i].children[n].className = "";
                    }
                });
                function shape_format(arr){//装换形状数组
                    switch(arr[0].length){
                        case 2:
                            arr[0].unshift(0);
                            arr[0].push(0);
                            arr[1].unshift(0);
                            arr[1].push(0);
                            break;
                        case 3:
                            arr[0].push(0);
                            arr[1].push(0);
                            break;
                        case 4:
                            arr.unshift([0,0,0,0]);
                    }
                    return arr;
                }
            }

            function convert(number,span){//数字输出
                number = number.toString();
                for(var i= 0,len = span.length-number.length;i<len;i++){
                    number = "n" + number;
                }

                for(var n= 0,le=span.length;n<le;n++){
                    span[n].className = "s_"+number.charAt(n);
                }
            }
        },

        //事件状态
        event_state : {
            timeout : {},
            flag : {}
        }
    };

    //方块类
    function Block(n){
        this.shape_cur = [];
        this.xy_cur = [0,4];
        this.finish = false;
        this.timeStamp = new Date().getTime();
        this.origin_type = 0;
        switch(n){
            case 0://I
                this.shape_cur.push([1,1,1,1]);
                this.xy_cur = [0,3];
                this.origin = [[1,-1],[-1,1]];
                break;
            case 1://L
                this.shape_cur.push([0,0,1]);
                this.shape_cur.push([1,1,1]);
                this.type = "L";
                this.origin = [[0,0],[0,1],[1,-1],[-1,0]];
                break;
            case 2://J
                this.shape_cur.push([1,0,0]);
                this.shape_cur.push([1,1,1]);
                this.origin = [[0,0],[0,1],[1,-1],[-1,0]];
                break;
            case 3://Z
                this.shape_cur.push([1,1,0]);
                this.shape_cur.push([0,1,1]);
                this.origin = [[0,0]];
                break;
            case 4://S
                this.shape_cur.push([0,1,1]);
                this.shape_cur.push([1,1,0]);
                this.origin = [[0,0]];
                break;
            case 5://O
                this.shape_cur.push([1,1]);
                this.shape_cur.push([1,1]);
                this.origin = [[0,0]];
                break;
            case 6://T
                this.shape_cur.push([0,1,0]);
                this.shape_cur.push([1,1,1]);
                this.origin = [[0,0],[0,1],[1,-1],[-1,0]];
        }
    }

    //旋转
    Block.prototype.rotate = function(){
        sounds_resource.rotate.play();
        var _this = this,
            state = get_state();

        if(!this.want(state.xy,state.shape)){
            return;
        }
        this.shape_prev = arr_clone(this.shape_cur);
        this.xy_prev = arr_clone(this.xy_cur);

        this.shape_cur = state.shape;
        this.xy_cur = state.xy;
        this.origin_type = state.type;
        this.fresh();


        function get_state(){
            var index = _this.origin_type+1 !== _this.origin.length?_this.origin_type+1: 0,
                shape = rotate(_this.shape_cur),
                y = _this.xy_cur[0]+_this.origin[index][0],
                x = _this.xy_cur[1]+_this.origin[index][1];
            return {xy:[y,x],type:index,shape:shape};
        }

        function rotate(arr){
            var tar = [];
            for_for(arr,function(e,i,n){
                if(tar[n] === undefined){
                    tar[n] = [];
                }
                tar[n].unshift(e);
            });
            return tar;
        }
    };

    //刷新
    Block.prototype.fresh = function(){
        var xy_cur = this.xy_cur,
            xy_prev = this.xy_prev;

        if(this.shape_prev){
            for_for(this.shape_prev,function(e,i,n){
                if(e) tetris.cache_delete([xy_prev[0]+i,xy_prev[1]+n]);
            });
        }

        for_for(this.shape_cur,function(e,i,n){
            if(e) tetris.cache_insert([xy_cur[0]+i,xy_cur[1]+n]);
        });
        this.shape_prev = arr_clone(this.shape_cur);
        this.xy_prev = arr_clone(this.xy_cur);

        tetris.fresh();
    };

    //下落一行
    Block.prototype.drop = function(method){

        if(this.finish) return false;
        if(!this.want([this.xy_cur[0]+1,this.xy_cur[1]])){
            this.done(method);
            return false;
        }
        this.xy_prev = arr_clone(this.xy_cur);
        this.xy_cur[0] += 1;
        this.timeStamp = new Date().getTime();
        this.fresh();
        return true;
    };

    //置底
    Block.prototype.fall = function(){
        clearTimeout(this.time);
        while(this.drop()){}
    };

    //用户操作向下
    Block.prototype.move_down = function(){
        sounds_resource.step.play();
        if(this.finish) return false;
        clearTimeout(this.time);
        if(this.drop()){
            tetris.auto();
        }
    };

    //是否能移动到目标
    Block.prototype.want = function(xy,shape){
        xy = xy || this.xy_cur;
        shape = shape || this.shape_cur;
        if(xy[1]<0 || xy[0]+shape.length>20 || xy[1]+shape[0].length>10){
            return false;
        }

        var _this = this;
        for_for(this.shape_cur,function(e,i,n){
            if(e) tetris.cache_delete([_this.xy_cur[0]+i,_this.xy_cur[1]+n]);
        });
        var rt = for_for(shape,function(e,i,n){
            if(!e) return;
            if(xy[0]+i<0) return;//处理初始时rotate
            if(tetris.cache[xy[0]+i][xy[1]+n]){
                return false;
            }
        });
        for_for(this.shape_cur,function(e,i,n){
            if(e) tetris.cache_insert([_this.xy_cur[0]+i,_this.xy_cur[1]+n]);
        });
        return rt;
    };

    //向右
    Block.prototype.right = function(){
        sounds_resource.step.play();
        if(this.finish) return false;
        var is = this.want([this.xy_cur[0],this.xy_cur[1]+1]),
            delay  = [60,65,70,75,80,85,90,95,100][tetris.level-1];
        this.timeStamp += parseInt(is?delay:delay/1.5);
        var remain = (tetris.speed[tetris.level-1]-(new Date().getTime()-this.timeStamp));
        tetris.auto(remain);
        if(!is){
            return false;
        }
        this.xy_prev = arr_clone(this.xy_cur);
        this.xy_cur[1] += 1;

        this.fresh();
        return true;
    };

    //向左
    Block.prototype.left = function(){
        sounds_resource.step.play();
        if(this.finish) return false;
        var is = this.want([this.xy_cur[0],this.xy_cur[1]-1]),
            delay  = [60,65,70,75,80,85,90,95,100][tetris.level-1];
        this.timeStamp += parseInt(is?delay:delay/1.5);
        var remain = (tetris.speed[tetris.level-1]-(new Date().getTime()-this.timeStamp));
        tetris.auto(remain);
        if(!is){
            return false;
        }
        this.xy_prev = arr_clone(this.xy_cur);
        this.xy_cur[1] -= 1;
        this.fresh();
        return true;
    };

    //下落完成
    Block.prototype.done = function(){
        this.finish = true;
        var _this = this,
            xy = this.xy_cur,
            count = 0;

        for_for(this.shape_cur,function(e,i,n){
            if(e){
                if(xy[0]+i>=0){
                    tetris.b[xy[0]+i][xy[1]+n].className = "c d";
                }
                t(function(){
                    if(xy[0]+i>=0){
                        tetris.b[xy[0]+i][xy[1]+n].className = "c";
                    }
                    count++;
                    if(count === 4){//回调
                        clearTimeout(_this.time);
                        var is_clear = tetris.is_clear();
                        if(is_clear){
                            tetris.clear(is_clear);
                        }else{
                            sounds_resource.fall.play();
                            tetris.scores += 10+(tetris.level-1)*2;
                            tetris.round();
                        }
                    }
                },50);
            }
        });
    };

    //按键控制集合
    var control = {
        //旋转
        rotate : {
            on:function(o){
                if(!tetris.run){
                    if(o.m === "keyboard"){
                        tetris.lines_start = ++tetris.lines_start > 10? 0 : tetris.lines_start;
                        sounds_resource.step.play();
                        tetris.status_show();
                    }else if(o.m === "touch"){
                        tetris.start();
                        return;
                    }
                    return;
                }
                f_catch({
                    name:'rotate',
                    notTimeout:true,
                    func:function(){
                        tetris.block.rotate();
                    }
                });
            },
            off:function(){
                f_throw({name:'rotate'});
            }
        },

        //置底
        fall : {
            on:function(o){
                if(!tetris.run){
                    if(o.m === "keyboard"){
                        tetris.start();
                    }else if(o.m === "touch"){
                        tetris.lines_start = ++tetris.lines_start > 10? 0 : tetris.lines_start;
                        sounds_resource.step.play();
                        tetris.status_show();
                        return;
                    }
                    return;
                }
                f_catch({
                    name:'fall',
                    notTimeout:true,
                    func:function(){
                        tetris.block.fall();
                    }
                });
            },
            off:function(){
                f_throw({name:'fall'});
            }
        },

        //向左
        left : {
            on:function(){
                if(!tetris.run){
                    tetris.level_start = --tetris.level_start < 1? 9 : tetris.level_start;
                    sounds_resource.step.play();
                    tetris.status_show();
                    return;
                }
                f_catch({
                    name:'left',
                    begin:200,
                    interval:100,
                    func:function(){
                        tetris.block.left();
                    }
                });
            },
            off:function(){
                f_throw({name:'left'});
            }
        },

        //向右
        right : {
            on:function(){
                if(!tetris.run){
                    tetris.level_start = ++tetris.level_start > 9? 1 : tetris.level_start;
                    sounds_resource.step.play();
                    tetris.status_show();
                    return;
                }
                f_catch({
                    name:'right',
                    begin:200,
                    interval:100,
                    func:function(){
                        tetris.block.right();
                    }
                });
            },
            off:function(){
                f_throw({name:'right'});
            }
        },

        //向下
        drop : {
            on:function(){
                if(!tetris.run){
                    tetris.lines_start = --tetris.lines_start < 0? 10 : tetris.lines_start;
                    sounds_resource.step.play();
                    tetris.status_show();
                    return;
                }
                f_catch({
                    name:'drop',
                    begin:40,
                    interval:40,
                    func:function(){
                        tetris.block.move_down();
                    }
                });
            },
            off:function(){
                f_throw({name:'drop'});
            }
        },

        //暂停
        pause : {
            on:function(){
                if(!tetris.run){
                    tetris.start();
                    return;
                }
                f_catch({
                    name:'pause',
                    notTimeout:true,

                    func:function(){
                        if(!tetris.pause){
                            tetris.pause = true;
                        }else{
                            tetris.pause = false;
                            tetris.auto();
                        }
                    }
                });
            },
            off:function(){
                f_throw({name:'pause'});
            }
        },

        //重新开始
        reset : {
            on:function(){
                f_catch({
                    name:'reset',
                    notTimeout:true,
                    func:function(){}
                });
            },
            off:function(){
                f_throw({
                    name:'reset',
                    func:function(){
                        if(!tetris.run){
                            tetris.start();
                            return;
                        }
                        setTimeout(function(){
                            if(window.confirm("重新来吗？你的当前成绩将不被记入积分榜")){
                               tetris.push();
                           }
                        },10);
                    }
                });
            }
        },

        //音乐开光
        sounds : {
            on:function(){
                f_catch({
                    name:'sounds',
                    notTimeout:true,
                    func:function(){
                        if(!tetris.sounds){
                            tetris.sounds = true;
                        }else{
                            tetris.sounds = false;
                            sounds_resource.pause();
                        }
                        tetris.status_show();
                    }
                });
            },
            off:function(){
                f_throw({name:'sounds'});
            }
        },

        //显示积分榜
        rank : {
            on:function(){
                f_catch({
                    name:'rank',
                    notTimeout:true,
                    func:function(){}
                });
            },
            off:function(){
                f_throw({
                    name:'rank',
                    func:function(){
                        tetris.rank_show();
                    }
                });
            }
        }
    };

    //音效资源、方法集合
    var sounds_resource = {
        init : function(){
            var sounds = id("sounds_box").children;
            for(var i= 0,len=sounds.length;i<len;i++){
                var ID = sounds[i].id.slice(2);
                this[ID] = {};
                this[ID].elm = sounds[i].children;
                this[ID].length = this[ID].elm.length;
                this[ID].index = 0;
                this[ID].play = function(){
                    if(!tetris.sounds){
                        return;
                    }
                    if(this.elm[this.index].play){//支持audio的浏览器
                        this.elm[this.index].play();
                    }
                    this.index = ++this.index >= this.length?0:this.index;
                };
                this[ID].stop = function(){
                    for(var n= 0,len1 = this.elm.length;n<len1;n++){
                        this.elm[n].pause();
                    }
                };
            }
            this.pause = function(){
                for(var i in this){
                    if(i === "init" || i === "pause"){
                        continue;
                    }
                    for(var n in this[i].elm){
                        if(this[i].elm[n].pause){
                            this[i].elm[n].pause();
                        }
                    }
                }
            };
        }
    };

    //键盘按下
    function keydown(event){
        event = event || window.event;
        var code = event.keyCode,
            //空格,下，上，左，右
            codes = [32,40,38,37,39,82,77,80,76],
            f = ['fall','drop','rotate','left','right','reset','sounds','pause','rank'];

        for(var i= 0,len=codes.length;i<len;i++){
            if(code !== codes[i]){
                continue;
            }
            //阻止默认操作
            if(event.preventDefault){
                event.preventDefault();
            }
            //    if(event.returnValue !== undefined){
            event.returnValue = false;
            //    }
            //阻止事件传播
            if(event.stopPropagation){
                event.stopPropagation();
            }
            if(event.cancelBubble !== undefined){
                event.cancelBubble = true;
            }
            if(tetris.lock){
                return;
            }
            control[f[i]].on({m:"keyboard"});
        }
    }

    //键盘松开
    function keyup(event){
        var code = event.keyCode,
        //空格,下，上，左，右
            codes = [32,40,38,37,39,82,77,80,76],
            f = ['fall','drop','rotate','left','right','reset','sounds','pause','rank'];

        for(var i= 0,len=codes.length;i<len;i++){
            if(code !== codes[i]){
                continue;
            }
            if(tetris.lock){
                return;
            }
            control[f[i]].off();
        }
    }

    //捕获事件
    function f_catch(o){
        if(tetris.event_state.flag[o.name]){
            return;
        }
        var count = 0;
        o.func(count);
        if(o.name !== "pause" && o.name !== "reset" && o.name !== "sounds" && o.name !== "sounds" && o.name !== "rank"){
            tetris.pause = false;
        }
        tetris.event_state.flag[o.name] = true;
        for(var i in tetris.event_state.timeout){
            if(i === o.name){
                continue;
            }
            clearTimeout(tetris.event_state.timeout[i]);//清除其他事件
        }
        (function(notTimeout){
            var ar = arguments;
            if(notTimeout){
                return;
            }
            tetris.event_state.timeout[o.name] = t(function(){
                o.func(++count);
                ar.callee();
            },!count?o.begin:o.interval);

        }(o.notTimeout));
    }

    //释放事件
    function f_throw(o){
        clearTimeout(tetris.event_state.timeout[o.name]);
        tetris.event_state.flag[o.name] = false;
        if(o.func){
            o.func();
        }
    }

    //数组深复制
    function arr_clone(a){
        var new_a = [];
        for(var i= 0,len= a.length;i<len;i++){
            if(is_array(a[i])){
                new_a.push(arguments.callee(a[i]));
            }else{
                new_a.push(a[i]);
            }
        }
        return new_a;
    }

    //遍历数组集合
    function for_for(arr,callback){
        var rt = true;
        for(var i= 0,len1 = arr.length;i<len1;i++){
            for(var n= 0,len2 = arr[i].length;n<len2;n++){
                if(typeof callback === "function"){
                    if(callback.call(arr,arr[i][n],i,n) === false){
                        rt = false;
                    }
                }
            }
        }
        return rt;
    }

    //查找元素
    function id(i){
        return document.getElementById(i);
    }

    //写cookie
    function setCookie(name, value){
        var exp = new Date();
        exp.setTime(exp.getTime() + 3650*24*60*60*1000); //设置cookie的期限
        document.cookie = name+"="+escape(value)+"; expires"+"="+exp.toGMTString();//创建cookie
    }

    //读cookie
    function getCookie(name){
        if (document.cookie.length>0){
            c_start=document.cookie.indexOf(name + "=");
            if (c_start!==-1){
                c_start=c_start + name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end===-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    }

    //判断是否为数组
    function is_array(n){
        return Object.prototype.toString.call(n).slice(8,13) === "Array";
    }

    //浏览器状态
    function win(){
        var w = 0,h=0;
        if (window.innerWidth){
            w = window.innerWidth;
            h = window.innerHeight;
        }else if ((document.body) && (document.body.clientWidth)){
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        }else if (document.documentElement && document.documentElement.clientWidth){
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        }
        return {w:w,h:h,scale:h/w};
    }

    //简化setTimeout
    var t = setTimeout;

    //动画开始
    t(function(){
        tetris.init();
    },2000);

    //分享文案
    t(function(){
        tetris.share();
    },1000);

    //移动端默认禁音（解决卡顿）
    (function(){
        var ua = navigator.userAgent,
            android = /Android (\d+\.\d+)/.test(ua),
            iphone = ua.indexOf("iPhone")>-1,
            ipod = ua.indexOf("iPod")>-1,
            ipad = ua.indexOf("iPad")>-1,
            nokiaN = ua.indexOf("NokiaN")>-1;
        tetris.is_mobile = android || iphone || ipod || ipad || nokiaN;
        if(tetris.is_mobile) {
            id("load").getElementsByTagName("p")[0].style.display = "block";
            id("wrap").style.overflow = "hidden";
            tetris.sounds = false;
        }
    }());

}());