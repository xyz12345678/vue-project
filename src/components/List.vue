<template>
  <div id="app-4">
    <ol>
        <li v-for="(todo,index) in todos">
        {{ todo.text}}-{{index}}
        </li>
    </ol>
    <ul>
        <li v-for="(value,key) in listobj">
        {{ key }}: {{ value }}
        </li>
    </ul>
    <div>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="text">文字按钮</el-button>
    </div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
        value1: true,
        value2: true,
        todos: [
            { text: '学习 JavaScript' },
            { text: '学习 Vue' },
            { text: '整个牛项目' }
        ],
        listobj:{
            test1:"ewrwer",
            test2:"w2werwer",
            test3:"234234"
        }
    }
  }
}
</script>
<style scoped lang="less">
#app-4{
    background-color: red;
    ol{
        color: #999;
    }
}
</style>