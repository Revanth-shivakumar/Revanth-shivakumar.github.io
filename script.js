const listContainer=document.querySelector('[data-lists]')
const Listform=document.querySelector('[new-list-form]')
const listInput=document.querySelector('[new-list-input]')
const DeleteListButton=document.querySelector('[delete-list]')
const todoListDisplay=document.querySelector('[to-do-list-display]')
const listName=document.querySelector('[list-name]')
const listCount=document.querySelector('[task-count]')
const allTasksContainer=document.querySelector('[all-tasks]')
const taskTemplate=document.getElementById('template-task')
const newTaskForm=document.querySelector('[new-task-form]')
const newTaskInput=document.querySelector('[new-task-input]')
const clearCompleted=document.querySelector('[clear-completed]')



 
//getting form input and name from html
const LOCAL_STORAGE_KEY='task.lists'
const LOCAL_STORAGE_SELECTED_ID_KEY='task.selectedlistid'//TO TRACK LIST SELECTIONS with their IDs
//adding event listener to the lsit container
listContainer.addEventListener('click',f=>{
    if (f.target.tagName.toLowerCase()==='li'){
        selectedlistid=f.target.dataset.listId
        save_and_display()
    }
})
DeleteListButton.addEventListener('click',e=>{
   lists=lists.filter(list=>list.id!==selectedlistid)
   selectedlistid=null
   save_and_display()


})

let lists=JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ||[]
//contains task list
let selectedlistid=localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY)
function provideList(){
    // <li class="list-name">College</li>
    clearELement(listContainer);
    provideTasks()
    //to show list only when they are selected and to set display to noone when no list 
    //is selected
    const selectedList=lists.find(list=>list.id===selectedlistid)
    if(selectedlistid==null){
        todoListDisplay.style.display='none'
    }else{
        todoListDisplay.style.display=''
        listName.innerText=selectedList.name
        showTaskCount(selectedList)
        clearELement(allTasksContainer)
        showTasks(selectedList)
    }
function showTasks(selectedList){
    selectedList.tasks.forEach(task=>{
        const tasksection=document.importNode(taskTemplate.content,true)
        const checkbox=tasksection.querySelector('input')
        const label=tasksection.querySelector('label')
        checkbox.id=task.id
        checkbox.checked=task.complete
        label.htmlFor=task.id
        label.append(task.name)
        allTasksContainer.appendChild(tasksection)



    })
}







     
}
function provideTasks(){
    lists.forEach(list=>{
        const listElement=document.createElement('li')
        //creating a list element 
        listElement.dataset.listId=list.id
        //storing elements id in listelement
        listElement.classList.add("list-name")
        //adding class to the list element
        listElement.innerText=list.name
        if(list.id==selectedlistid){
            listElement.classList.add('active')
        }
        listContainer.appendChild(listElement)
        //adding the list-element to list container
 



})
}
Listform.addEventListener('submit',e=>{
 e.preventDefault()//prevents empty submissionn
 const ListName=listInput.value
 if(ListName==null||ListName==='')return
 const list=createList(ListName)
 listInput.value=null
 lists.push(list)
 save_and_display()
})
allTasksContainer.addEventListener('click',e=>{
 if(e.target.tagName.toLowerCase()==='input'){
     const selectedList=lists.find(list=>list.id===selectedlistid)
     const selectedTask=selectedList.tasks.find(task=>task.id===e.target.id)
     selectedTask.complete=e.target.checked
saveItem()
showTaskCount(selectedList)
clearELement(allTasksContainer)
provideTasks(selectedList)

 }


})
function showTaskCount(selectedList) {
    const inCompleteTaskcount=selectedList.tasks.filter(task=>!task.complete).length
    const suffixString=inCompleteTaskcount===1?"task":"tasks" 
    listCount.innerText= `${inCompleteTaskcount} ${suffixString} remaining`    
}   
newTaskForm.addEventListener('submit',e=>{
    // e.preventDefault()//prevents empty submissionn
    const taskName=newTaskInput.value
    if(taskName==null||taskName==='')return
    const task=createTask(taskName)
    newTaskInput.value=null
    const selectedListHeading=lists.find(list=>list.id===selectedlistid)
    selectedListHeading.tasks.push(task)
    save_and_display()
   })
function createTask(taskName) {
    return {
        id:Date.now().toString() ,name:taskName,complete:false,         //based on current time

    }

}  
   

function createList(listName){
    return {
        id:Date.now().toString() ,name:listName,tasks:[]           //based on current time

    }
}
function save_and_display(){
    saveItem()
 provideList()
}
function saveItem(){
  localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_KEY,selectedlistid)//saving selected item in 
  //local storage
   
}
//converting object to string and storing it in lists array
function clearELement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }

 
}
 
clearCompleted.addEventListener('click',e=>{
    const selectedList=lists.find(list=>list.id===selectedlistid)
    selectedList.tasks=selectedList.tasks.filter(task=>!task.complete)
    save_and_display()
})
provideList()


