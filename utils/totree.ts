const listToTree = (list:any) =>{

    let newObj = list;
    newObj && newObj.map((itm:any, ind:any)=>{

        itm.label = itm.title
        itm.value = itm.id

    })

    var map = {}, node, roots = [], i;

    newObj && newObj.map((item:any, index:any)=>{
        map[newObj[index].id] = index; // initialize the map

        newObj[index].children = []; // initialize the children

    })
    // console.log(map);

    newObj && newObj.map((item:any, index:any)=>{
        node = newObj[index];
        if (node.parent_id !== null) {  //Has child
            newObj[map[node.parent_id]].children.push(node);
          } else {
            roots.push(node);
        }
    })

    const res = roots
    
    /**Triming with pattern solution self test: https://regex101.com/ */
    let modified = JSON.stringify(res).replace(/,s*"children":\s*\[\]/g,"")
    let result = JSON.parse(modified);

    // return {result, fallback: false };
    return result;

}
export default listToTree
