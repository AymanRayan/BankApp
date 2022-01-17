// catch the pages and btn
const addUser = document.querySelector('#addUser')
const content = document.querySelector('#content')
const single = document.querySelector('#single')
const editForm =document.querySelector("#editForm")
const addDraw = document.querySelector("#addDraw")
const addDrawForm = document.querySelector("#addDrawForm")
const showAcc = document.querySelector("#showAcc")

//array of object to catch the form data
const userMainHeads = [
    {name:"accNum", dataStore:"value" ,isDefault: true},
    {name:"name",dataStore:"value" ,isDefault: false},
    {name:"address", dataStore:"value" ,isDefault: false},
    {name:"phone", dataStore:"value" ,isDefault: false},
    {name:"initial", dataStore:"value" ,isDefault: false},
    
    transaction = [
        {name:"add" , dataVal:"value"},
        {name:"withDraw" , dataVal:"value"}
    ]
]
//read data from SL Fun
const readDataFromStorage = () => {
    let data
    //try the code 
    try{
        //to get data from local storage 
        data = JSON.parse(localStorage.getItem('users'))
        //check that the data is array .. throw defines special error
        if(!Array.isArray(data)) throw new Error('data isn\'t array')
    }
    //catch handle the errors
    catch(exp){
        data=[]
    }
    return data
}
//set the data to SL
const setDataToStorage = (myData) => {
    //check that the data is array
    if(!Array.isArray(myData)) myData=[]
    //turn the data to string as local storage accept only strings
    myData = JSON.stringify(myData)
    localStorage.setItem('users', myData)
}
//creat element fun.
const createMyOwnElement = (element,parent, classes="", textContent="",attributes=[])=>{
    //creat new element in html
    const el = document.createElement(element)
    //creat child to exists element
    parent.appendChild(el)
    //check that there is class att or not then if yes add lists of them
    if(classes!="") el.classList = classes
    ////check that there is content or not then if yes add/change it
    if(textContent!="") el.textContent = textContent
    //loop for each attr to add attributes and values
    attributes.forEach(attribute=>{
        el.setAttribute(attribute.attName, attribute.attrVal)
    })
    //return created element to reused it
    return el
}
//Fun to draw data in table
const drawItem =() => {
    //refresh the page
    content.innerHTML=""
    //to reread the data from local storage after delete
    const customers= readDataFromStorage();
    if(customers.length==0){
        const tr = createMyOwnElement('tr',content, "alert alert-danger text-center")
            createMyOwnElement('td', tr,"", "No Users Yet", [{attName:"colspan", attrVal:6}] )
    }else{
        //creat row for each customer
        customers.forEach((customer,i) => {
            const tr = createMyOwnElement('tr',content)
            //get the data of the customer in the row
            userMainHeads.forEach( head=> {
                createMyOwnElement('td', tr,"",customer[head.name]) 
            })
            //creat btns
            const td = createMyOwnElement('td',tr)
            const delBtn = createMyOwnElement('button', td, "btn btn-danger mx-3", "delete")
            delBtn.addEventListener('click',() => delUser(customers, customer.accNum))
            const editBtn = createMyOwnElement('button', td, "btn btn-warning mx-3", "Edit")
            editBtn.addEventListener("click", (e) => edit(i))
            const showBtn = createMyOwnElement('button', td, "btn btn-primary mx-3", "Show")
            showBtn.addEventListener("click", (e) => show(customer))
            const add_WithBtn = createMyOwnElement('button', td, "btn btn-success mx-3", "Add / Withdraw")
            add_WithBtn.addEventListener('click',(e)=>addWith(customer))

        })
    }
}
//del Fun take array of obj and property  
delUser = (customers , accNum) => {
    //filter the array using the given prperty and save it as new data 
    newData = customers.filter(u => u.accNum != accNum)
    //save change in local storage
    setDataToStorage(newData)
    //redraw the table
    drawItem()
}
//show Fun take single element in array to show it
show=(customer)=> {
    //set the customer data at localStorage .. user key word and change customer array to string as a local storage value
    localStorage.setItem("user",JSON.stringify(customer))
    //change the page to show single
    window.location.replace("single.html")
}
//draw table in single 
drawSingle = () => {
    try{
        //change the data from json/string to array and save it in user variable
        let user = JSON.parse(localStorage.getItem('user'));
        //if there is no user throw a special error at catch
        if(!user) throw new Error()
        const tr = createMyOwnElement('tr' , single)
        userMainHeads.forEach(head =>{
            if(!Array.isArray(head)){
                createMyOwnElement('td',tr,"",user[head.name])
            } else{
                head.forEach(h => {
                 createMyOwnElement('td',tr,"",user[h.name]) 
                })
            } 
        })
            
      //the throwen special error
      }catch(a){
        const tr = createMyOwnElement('tr', single,"alert alert-danger text-center")
        createMyOwnElement("td",tr,"","Error",[{attName:"colspan", attrVal:6}])
      }
 }
//edit Fun take index of array
edit=(index) => {
    //get the index of edit user
    localStorage.setItem('editIndex', index)
    window.location.replace("edit.html")
}
//addWith fun for button
addWith =(cust) =>{
    localStorage.setItem("customer",JSON.stringify(cust))
    window.location.replace('adddraw.html')
 }
 //function to draw add/withdraw
 drawAdd = (parent , c) =>{
 try{
     //check of the data
     if(!c) throw new Error()
     const tr = createMyOwnElement('tr' , parent)
     userMainHeads.forEach(head => {
         if (!Array.isArray(head)){
         createMyOwnElement('td',tr,"",c[head.name])
         }else{
           head.forEach(h => {
             createMyOwnElement('td',tr,"",c[h.name])
           })
         }
     })
       
 }catch(a){
 const tr = createMyOwnElement('tr', parent,"alert alert-danger text-center")
 createMyOwnElement("td",tr,"","Error",[{attName:"colspan", attrVal:6}])
 }
 }
//add user form 
if(addUser){
addUser.addEventListener('submit',function(e){
//prevent refresh page
e.preventDefault()
//read the data from local storage
const customers= readDataFromStorage(); 
///decleration of the object
 console.log(customers)
const user = {};
//loop for each element in data arr of obj 
 userMainHeads.forEach(head => {
     if(!Array.isArray(head)){
        if(head.isDefault){
            if(customers.length == 0){
              user[head.name] = 5000; 
            }else{
             user[head.name] =Number(customers[customers.length-1].accNum) + 1;
            }  
        }else{
           user[head.name] = this.elements[head.name][head.dataStore]
        }
     }
     
 });
//push the obj in the arr
customers.push(user)
//reset the form as this refer to the addUser
this.reset()
//set data from array to local stor.
 setDataToStorage(customers)
 //go to index page
window.location.replace("index.html")
})
}
if(content) drawItem()
if(single) drawSingle()
if(editForm){
    //read the data in arr
    const userData = readDataFromStorage()
    //get the id depends on the index
    let id = localStorage.getItem("editIndex")
    //catch the edit user
    let user = userData[id]
    userMainHeads.forEach(head => {
        //check that it is object
        if(!Array.isArray(head)){
            editForm.elements[head.name][head.dataStore]=user[head.name]
        }
    });
    editForm.addEventListener('submit' ,(e) => {
        e.preventDefault()
        userMainHeads.forEach(head => {
            if(!Array.isArray(head)){
                userData[id][head.name]=editForm.elements[head.name][head.dataStore]
            } 
        })
        //return the edited data to local storage
        setDataToStorage(userData)
        window.location.replace('index.html')
    })
}
//withdraw/add
if(addDrawForm){
    //get the data
    let cust = JSON.parse(localStorage.getItem("customer"))
     //store the data in array
    let custData = readDataFromStorage();
    //find the obj in arr by accNum
    let obj = custData.find(o => o.accNum === cust.accNum)
    //get the index
    let i = custData.indexOf(obj)

    drawAdd(addDraw , cust)
  //add functions to submit button
    addDrawForm.addEventListener("submit" , (e) => {
        //prevent the refresh
        e.preventDefault()
        //looping in the transaction array 
        userMainHeads.forEach(head => {
            if(Array.isArray(head)){
                head.forEach(h => {
                    custData[i][h.name] = addDrawForm.elements[h.name][h.dataVal]
                }) 
            }
        });
        // custData[i][head.name] = addDrawForm.elements[head.name][head.dataStore]
        //change the initial value
        let theChange = custData[i].add - custData[i].withDraw
        let int = Number(custData[i].initial)
        custData[i].initial = int + theChange

        //set the new data in the local storage
        setDataToStorage(custData)
        //set the change in update string in LS
        localStorage.setItem("update",JSON.stringify(custData[i]))
        //catch the change in array
        let d = JSON.parse(localStorage.getItem("update"))
        //call drawAdd Fun to draw updates
        drawAdd(addDraw ,d);
        //show the transaactions
        const tr = createMyOwnElement('tr' , addDraw)
        createMyOwnElement("th",tr,"","Transactions")
        createMyOwnElement('td',tr,"",`The added money = ${custData[i].add}$ ,The withdrawed money = ${custData[i].withDraw}$ and the Total balance = ${custData[i].initial}$`,[{attName:"colspan",attrVal:"5"}])
        
        //reset the form
        addDrawForm.reset()

    })
    //add function to show button
    showAcc.addEventListener('click', (e) => {
        show(custData[i])
    });
}
