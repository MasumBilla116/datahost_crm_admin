import React from 'react'

export default function TreeViewData(jsonData){
    const result = []
    for (const parent of jsonData) {
        if (parent.children) {
        result.push({
          value:parent.id,
          label:parent.title,
          children: TreeViewData(parent.children), //recursive
        })
      } else {
        result.push({value:parent.id, label:parent.title, children:[]})
      }
    }

    return result;
}

