import './App.scss'
import avatar from './images/bozai.png'
import React from 'react'
import _ from 'lodash'
import {v4 as uuidV4} from 'uuid'
import dayjs from 'dayjs'
import { useRef , useEffect} from'react'
import axios from 'axios'
/**
 * 评论列表的渲染和操作
 *
 * 1. 根据状态渲染评论列表
 * 2. 删除评论
 */

// 评论列表数据


// 当前登录用户信息
const user = {
  // 用户id
  uid: '30009257',
  // 用户头像
  avatar,
  // 用户昵称
  uname: '束缚',
}

/**
 * 导航 Tab 的渲染和操作
 *
 * 1. 渲染导航 Tab 和高亮
 * 2. 评论列表排序
 *  最热 => 喜欢数量降序
 *  最新 => 创建时间降序
 */

// 导航 Tab 数组
const tabs = [
  { type: 'hot', text: '最热' },
  { type: 'time', text: '最新' },
]

function useGetList() {
  const [commentList, setcommentList] = React.useState([])

  useEffect(()=>{
    async function getList(){
      const res = await axios.get('http://localhost:3004/list')
      setcommentList(res.data)
    }
    getList()
  },[])


  //评论组件
  

return {
  commentList,
  setcommentList
}


}
function Item({item,handleDel}){
  return(
  <div className="content-wrap" key = {item.rpid}>
              {/* 用户名 */}
              <div className="user-info">
                <div className="user-name">{item.user.uname}</div>
              </div>
              {/* 评论内容 */}
              <div className="root-reply">
                <span className="reply-content">{item.content}</span>
                <div className="reply-info">
                  {/* 评论时间 */}
                  <span className="reply-time">{item.ctime}</span>
                  {/* 评论数量 */}
                  <span className="reply-time">点赞数:{item.like}</span>
                  {user.uid === item.user.uid && 
                  <span className="delete-btn" onClick={() => handleDel(item.rpid)}>
                    删除
                  </span>}
                  

                </div>
              </div>
            </div>
  )
}

const App = () => {
  // 评论列表数据
  //const [commentList, setcommentList] = React.useState(_.orderBy(defaultList, ['like'], ['desc']))

  const {commentList,setcommentList} = useGetList()

  const [type,setType] = React.useState('hot')

  //tab栏高亮
  const handleTabchange = (type)=>{
    setType(type)
    if(type === 'hot'){
      setcommentList(_.orderBy(commentList, ['like'], ['desc']))
    }else{
      setcommentList(_.orderBy(commentList, ['ctime'], ['desc']))
    }
  }

  // 删除评论
const handleDel = (rpid) => {
  console.log(rpid)
  setcommentList(commentList.filter(item => item.rpid!== rpid))

}

//发表评论
 const [content,setContent] = React.useState('')

 const inputRef = useRef(null)

 const handlepubilsh = () => {
  setcommentList([
    ...commentList, 
    {
      rpid: uuidV4(),
      user: {
        uid: '30009257',
        avatar,
        uname: '束缚',
      },
      content: content,
      ctime: dayjs().format('MM-DD HH:mm'),
      like: 0,
    },
    ])
    //清空输入框
    setContent('')
    //重新聚焦光标
    //document.querySelector('.reply-box-textarea').focus()
    inputRef.current.focus()
 }


  return (
    <div className="app">
      {/* 导航 Tab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">评论</span>
            {/* 评论数量 */}
            <span className="total-reply">{10}</span>
          </li>
          <li className="nav-sort">
            {/* 高亮类名： active */}
            {tabs.map(item => (
              <span 
                className={`nav-item ${type === item.type && 'active'}`} 
                onClick={()=>handleTabchange(item.type)} 
                key = {item.type}>{item.text}
            </span>))}
            
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        {/* 发表评论 */}
        <div className="box-normal">
          {/* 当前用户头像 */}
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src={avatar} alt="用户头像" />
            </div>
          </div>
          <div className="reply-box-wrap">
            {/* 评论框 */}
            <textarea
              className="reply-box-textarea"
              placeholder="发一条友善的评论"
              value={content}
              onChange={e => setContent(e.target.value)}
              ref = {inputRef}
            />
            {/* 发布按钮 */}
            <div className="reply-box-send" onClick={handlepubilsh}>
              <div className="send-text" >发布</div>
            </div>
          </div>
        </div>
        {/* 评论列表 */}
        <div className="reply-list">
          {/* 评论项 */}
          <div className="reply-item">
            {/* 头像 */}
            <div className="root-reply-avatar">
              <div className="bili-avatar">
                <img
                  className="bili-avatar-img"
                  alt=""
                />
              </div>
            </div>
            {
            commentList.map((item,index) => (
              <Item key={item.rpid} item={item} handleDel={handleDel} />
              ))
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default App