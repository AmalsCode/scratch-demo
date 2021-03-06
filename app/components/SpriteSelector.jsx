const React = require('react');
const bindAll = require('lodash.bindall');
import { connect } from 'react-redux'

class SpriteSelector extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ['selectTarget']);
    this.state={
        targetsList:[]
    }
  }
  componentDidMount(){
    const {vm} = this.props
    /**
     * let targetsList=vm.runtime.targets 
     * 不能这么写,此时targets尚未渲染,console是异步的,检测不到未渲染的状态 
     */
    vm.on('targetsUpdate',(data)=>{
        this.setState({targetsList:data.targetList})
    })
  }
  selectTarget(obj){
    var targetid = obj.target.id;
    this.props.vm.setEditingTarget(targetid);
  }
  render() {
    const {targetsList} = this.state
    const {srcSourceList}=this.props
    let spriteList= [<p key='0'>点击图片切换角色</p>]
    // console.log('targetsList',targetsList,srcSourceList)
    targetsList.forEach((sprite,idx) => {
        let spriteText=sprite.name==='Stage'?"舞台"+idx:"精灵"+idx
        let srcMd5=''
        srcSourceList.forEach((srcSource)=>{
            if(sprite.name.startsWith(srcSource.srcName)){
                srcMd5=srcSource.srcMd5
            }
        })
        let src=`https://cdn.assets.scratch.mit.edu/internalapi/asset/${srcMd5}/get/`
        spriteList.push(
            <div style={{display:'inline-flex'}}  key={sprite.id}>
                <img 
                        value={sprite.name}
                        id={sprite.id}
                        src={src}
                        style={{width:70,height:70,display:'block',border:this.props.vm.editingTarget==sprite.id?'2px solid #179FD7':'none'}}
                        onClick={this.selectTarget}
                />
                <span>{spriteText}</span>
            </div>
        )
    });
    return (
        <div>
            {spriteList}
        </div>
    )
  }
}

  const mapStateToProps = state => {
    return {vm: state.vm,srcSourceList:state.srcSourceList}
  }
  const ConnectedSpriteSelector = connect(mapStateToProps)(SpriteSelector)
 export default ConnectedSpriteSelector;