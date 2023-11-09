function Validator(options){
    let selectorRules ={};
    function validate(inputElement, rule){
        let errorElement =  inputElement.parentElement.querySelector(options.errorSelector) 
        let errorMessage;
        //get rules of element
        let rules = selectorRules[rule.selecter];
        // loop through each rule and check , if error- > stop checking ( break);
        for( let i = 0; i< rules.length; ++i){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage)
                break;
        }    
        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')               
        }  
        return !errorMessage; // k co loi thi return false, error return true
    }


    const  formElement = document.querySelector(options.form);
    if(formElement){

        formElement.onsubmit = (e) =>{
            e.preventDefault();

            let isFormValid = true;

            options.rules.forEach(rule=>{
            let inputElement = formElement.querySelector(rule.selecter);
            let isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            let enableInputs = formElement.querySelectorAll('[name]:not([disable]');
            
            
           
            if(isFormValid){
                //truong hop submit vowi javascript
                if(typeof options.onSubmit === 'function'){
                    
                    let fromValues = Array.from(enableInputs).reduce(function(values,input){
                        values[input.name] = input.value;
                        return  values;
                    },{});
                    options.onSubmit(fromValues);
                }// truong hop submit voi html deafult 
                else{
                    formElement.submit();
                }
            }
            

        }

        // lap qua moi rule va xu ly ( listen to events like blur or input)
        options.rules.forEach((rule)=>{
            //save rules to selectorRules object;
            
            
            if(Array.isArray(selectorRules[rule.selecter])){
                selectorRules[rule.selecter].push(rule.test)
            }else{
                selectorRules[rule.selecter] = [rule.test]
            }

            let inputElement = formElement.querySelector(rule.selecter)
            if(inputElement){
                //handle the case blur happens
                inputElement.onblur = function(){
                    validate(inputElement, rule);
                }
                inputElement.oninput = function(){
                    let errorElement =  inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')               
                }
                // handle the case when the input box is entered
            }
        })

        // console.log(selectorRules);
    }
}
Validator.isRequired = function(selecter, message){
    return {
        selecter: selecter,
        test : function(value){
            return value.trim() ? undefined : message || 'Please enter this blank';
        }
    };
}


Validator.isEmail = function(selecter, message){
    return {
        selecter: selecter,
        test : function(value){
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please Enter correctly your eamil';
        }
    };
}

Validator.minLength = function(selecter,min, message){
    return {
        selecter: selecter,
        test : function(value){
            
            return value.length >= min ? undefined : message || `passowrd must be at least ${min} characters `;
        }
    };
}
Validator.isComfirmed = function(selecter, getConfirmValue, message){
    return {
        selecter : selecter,
        test: function(value){
            return value === getConfirmValue() ? undefined : message ||'password does not match';
        }
    }
}



