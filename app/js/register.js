    var $agree_btn = document.querySelector('.agree-btn');
    console.log( $agree_btn)
    $agree_btn.onclick = function(){
       this.parentNode.parentNode.parentNode.style.display='none';
    }

    function reg_Register(){
        this.phone=function(str) {
            var reg = /^1[35789]\d{9}$/;
            return reg.test(str);
        };
        this.mobileCode=function(str) {
            var reg = /^\d{6}$/;
            return reg.test(str);
        },
        this.password=function(str) {
            var reg = /^\w{6,20}$/;
            return reg.test(str);
        }
        //^[?!_]{1,}[a-zA-z]{1,}$|
       //^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$
       //字母+数字，字母+特殊字符，数字+特殊字符
    }
    const register = (function(){
        let reg_Password = false;
        return {
            init(ele){
                if(typeof ele==="string")
                this.$enter_Reg_form = document.querySelector(ele);
                this.$inputAll =  this.$enter_Reg_form.querySelectorAll('input');           
                // console.log(  this.$enter_Reg_form)
                this.$submit_btn = this.$enter_Reg_form.querySelector('.submit-btn');
                console.log( this.$submit_btn)
                this.$sendSmsCode =  this.$enter_Reg_form.querySelector('#sendSmsCode');
                this.event();
            },
            event(){
                var _this = this;
                const $sendSmsCode = function(){
                    //console.log(this)
                    if( _this.$enter_Reg_form["phone"].value==""){
                        let $aliasTip = _this.$enter_Reg_form["phone"].parentNode.parentNode.nextElementSibling;
                        //console.log( $aliasTip)
                        $aliasTip.style.opacity="1";
                        $aliasTip.innerHTML="请输入注册手机号";
                    }else{
                        var reg = new reg_Register();
                        var bool = reg.phone(_this.$enter_Reg_form["phone"].value);
                        if(bool){
                            this.innerHTML=`<i class="codeTime">60</i>秒后重新获取`;
                            let $send_success= this.parentNode.nextElementSibling;
                            $send_success.style.opacity="1";
                            let $codeTime = this.firstElementChild;
                            //console.log($codeTime)
                            this.timer = setInterval(_=>{                 
                                this.style.opacity="0.5";
                                let val =$codeTime.innerHTML; 
                                val--;   
                                $codeTime.innerHTML=val;                                                                                     
                                if(val==0){
                                    this.innerHTML='';
                                    clearInterval(this.timer);
                                    this.innerHTML ="获取短信验证码";                           
                                    $send_success.style.opacity='0';
                                    this.style.opacity="1";
                                   
                                }
                               
                            },1000)
                        }
                        
                    } 
                 }
                for(let i=0;i<this.$inputAll.length;i++){
                    this.$inputAll[i].onfocus = function(){
                        //手机验证
                        if(this.name=='phone'){
                            let $aliasTip=this.parentNode.parentNode.nextElementSibling;
                            //console.log($aliasTip)
                            let $ok = this.nextElementSibling;
                            $aliasTip.style.opacity="0";
                            this.onblur = function(){
                                if(this.value==""){
                                    $aliasTip.style.opacity="1";
                                    $aliasTip.innerHTML="输入不能为空"
                                }else{
                                    var reg = new reg_Register();
                                    var bool = reg.phone(this.value);
                                    //如果手机合法，再进入后台判断
                                    if(bool){
                                        sendAjax("../../server/php/judge_register.php",{
                                            data:{phone:this.value}
                                        })
                                        .then(res=>{
                                           // console.log(res)
                                            res = JSON.parse(res);
                                            if(res.code=="10000"){
                                                $aliasTip.style.opacity="1";
                                                $aliasTip.innerHTML="该手机号已被注册";
                                            }else if(res.code=="0"){
                                                //后台判断合法，才能点击获取验证码
                                                _this.$sendSmsCode.addEventListener('click',$sendSmsCode,false);
                                            }
                                        })
                                        $ok.style.display="block";
                                    }else{
                                        $aliasTip.style.opacity="1";
                                        $aliasTip.innerHTML="格式不正确，请输入正确的手机号";
                                    }
                                }
                            }                           
                        }
                        //判断输入密码在不断改变时，密码下面所出现的提示框
                        if(this.name=='password'){
                            let $suggestion = this.parentNode.parentNode.nextElementSibling;
                            $suggestion.style.display="block";
                            $suggestion.style.opacity="1";
                            $suggestion.innerHTML="请输入6-20个字符，由字母，数字和符号两种以上组合而成";
                            //console.log($suggestion)
                            let $ok = this.nextElementSibling;
                            $ok.style.width=20+'px';
                            $ok.style.height=20+'px';
                            $ok.style.background="url(../images/register/sprite.png) no-repeat top -93px left -50px";
                            this.oninput=function(){
                                $suggestion.style.display="block";
                                let $setPsw_rank = $suggestion.nextElementSibling;
                                if(this.value!=""){
                                    $ok.style.display="block";
                                    $suggestion.style.opacity="1";
                                }else{
                                    $ok.style.display="none";
                                }
                                if(this.value.length<6){
                                    $setPsw_rank.style.opacity='0';
                                }
                               else{
                                $setPsw_rank.style.opacity='1';
                                let $safetyAll = $setPsw_rank.children;                               
                                    if(this.value.search(/[a-z]|[A-Z]/)!=-1&&this.value.search(/[0-9]/)!=-1&&this.value.includes("_")){
                                        $safetyAll[1].style.background="#fa0";
                                        $safetyAll[2].style.background="#fa0";
                                        $safetyAll[3].style.background="#fa0";
                                        reg_Password = true;
                                    }
                                    else if(this.value.search(/[0-9]/)!=-1&&this.value.search(/[a-z]|[A-Z]/)!=-1){
                                        $safetyAll[1].style.background="#fa0";
                                        $safetyAll[2].style.background="#fa0";
                                        $safetyAll[3].style.background="#666";
                                        reg_Password = true;
                                    }
                                    else if(this.value.includes("_")&&this.value.search(/[a-z]|[A-Z]/)!=-1){
                                        $safetyAll[1].style.background="#fa0";
                                        $safetyAll[2].style.background="#fa0";
                                        $safetyAll[3].style.background="#666";
                                        reg_Password = true;
                                    } 
                                    else if(this.value.includes("_")&&this.value.search(/[0-9]/)!=-1){
                                        $safetyAll[1].style.background="#fa0";
                                        $safetyAll[2].style.background="#fa0";
                                        $safetyAll[3].style.background="#666";
                                        reg_Password = true;
                                    }else if((this.value.search(/[a-z]|[A-Z]/)!=-1||this.value.search(/[0-9]/)!=-1||this.value.includes("_"))){
                                        $safetyAll[1].style.background="#fa0";
                                        $safetyAll[2].style.background="#666";
                                        $safetyAll[3].style.background="#666";
                                        reg_Password = false;
                                    }
                               }
                            }   
                           
                        }
                        
                    }//给密码添加失去焦点事件
                     this.$inputAll[i].onblur =function(){                 
                        if(this.name=='password'){
                            _this.password = this.value;
                            let $suggestion = this.parentNode.parentNode.nextElementSibling;
                            //$suggestion.style.display="none";
                            $suggestion.style.opacity="1";
                             // $suggestion.style.display="none";
                             var count=2;
                             //10个字符 length=10
                             if(0<this.value.length&&this.value.length<6){
                                $suggestion.innerHTML="请输入6-20位密码";
                                return;
                             }else if(5<this.value.length && this.value.length<20){   
                                for(var i =1;i<this.value.length+1;i++){
                                    if(this.value[i]==this.value[i-1]){
                                        count++;
                                    }
                                }
                                if(count==i){
                                    $suggestion.innerHTML="不能全是同一个字符"; 
                                   return;     
                                }else{
                                   if(/^[0-9]+$/.test(this.value)){
                                       $suggestion.innerHTML="不能是纯数字";
                                       return; 
                                   }
                                   if(/^[A-Za-z]+$/.test(this.value)){
                                       console.log(this.value)
                                       console.log(/^[a-z]|[A-Z]+$/.test(this.value))
                                       $suggestion.innerHTML="不能是纯字母";
                                       return; 
                                   }
                                } 
                             }
                             
                            $suggestion.style.display="none";
                        }
                     }  
                }
                 this.$submit_btn.onclick = _=>{
                    let phone=this.$enter_Reg_form["phone"].value;
                    let password = this.password;
                     let $reg_R =  new reg_Register();
                     let reg_Phone = $reg_R.phone(phone);
                    const arr = [reg_Phone,reg_Password];
                    const $inputAll = [this.$inputAll[0],this.$inputAll[2]]
                    for(var i=0;i<arr.length;i++){
                        if(!arr[i]){
                           $inputAll[i].focus();
                            break;
                        }
                    }
                    if(i==arr.length){
                        sendAjax('../../server/php/register.php',{
                            method:'post',
                            data:{phone:phone,password:password}  
                          }).then(res=>{
                              console.log(res);
                          })
                    } 
                 }
            }
        }
    }())
  