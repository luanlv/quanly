import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import intersection from 'lodash/intersection'
import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio, Tabs} from 'antd';
import DO from './DO'
import moment from 'moment'
const TabPane = Tabs.TabPane;

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  user: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      init: false,
      visible: false,
      quaydau: false,
      data: {
        mien: 'bac'
      },
      phongban: [],
      DOs: []
    }
    this.init()
  }
  
  componentWillMount = async () => {
    // const date = await agent.DieuHanh.getDate();
    // const DOs = await agent.DieuHanh.getDOs(date.date);
    // this.setState({
    //   date: date.date,
    //   DOs: DOs,
    //   init: true
    // })
  }
  
  init = async () => {
    const date = await agent.DieuHanh.getDate();
    const DOs = await agent.DieuHanh.getDOs(date.date);
    this.setState({
      date: date.date,
      DOs: DOs,
      init: true
    })
  }

  render() {
    const role = this.props.user.role
    
    let lenhcho = []
    let chuanhan = []
    let danhan = []
    let hoanthanh = []
    let daduyet = []
    this.state.DOs.map((el, index) => {
      if(el.laixe === -1){
        lenhcho.push(el)
      } else if(el.tinhtrang === 0){
        chuanhan.push(el)
      } else if(el.tinhtrang === 1){
        danhan.push(el)
      } else if(el.tinhtrang === 2){
        hoanthanh.push(el)
      } else if(el.tinhtrang === 3){
        daduyet.push(el)
      }
    })
    return (
      <div className="home-page" style={{marginTop: 10, padding: 10}}>
        <h2 style={{textAlign: 'center', color: 'red'}}>{moment(this.state.date, 'YYYYMMDD').format('DD-MM-YYYY')}</h2>
        <Button type="primary" onClick={this.showModal1}>Thêm lệnh mới</Button>
        <Button type="danger" onClick={this.showModal2}>Lệnh điều xe (quay đầu)</Button>
        <hr
          style={{margin: 10}}
        />
        {/*// modal*/}
  
        <Tabs
          defaultActiveKey="1"
          tabPosition={"left"}
        >
          <TabPane tab={"Lệnh chờ " + "(" + lenhcho.length + ")"} key="1">
            {lenhcho.map((el, index) => {
              return (
                <div key={index}
                  style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "red": "#333", fontSize: 16, padding: 5, cursor: 'pointer'}}
                >
                  Mã DO: <b>{el._id}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <div key={index2} style={{paddingLeft: 20}}><b>+ {diemtra.name}</b></div>
                  })}
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={"Chưa nhận " + "(" + chuanhan.length + ")"} key="2">
            {chuanhan.map((el, index) => {
              return (
                <div key={index}
                     style={{borderRadius: 5, border: '1px solid', marginBottom: 10, borderColor: el.quaydau ? "red": "#333", fontSize: 16, padding: 5, cursor: 'pointer'}}
                >
                  Mã DO: <b>{el._id}</b>
                  <br/>
                  Lái xe: <b>{el.laixe}</b>
                  <br/>
                  Điểm xuất phát: <b>{el.diemxuatphat.name}</b>
                  <br/>
                  Điểm trả hàng: <b>{el.diemtrahang.length}</b> điểm
                  {el.diemtrahang.map((diemtra, index2) => {
                    return <div key={index2} style={{paddingLeft: 20}}><b>+ {diemtra.name}</b></div>
                  })}
                </div>
              )
            })}
          </TabPane>
          <TabPane tab={"Đã nhận " + "(" + danhan.length + ")"} key="3">Content of tab 3</TabPane>
          <TabPane tab={"Hoàn thành " + "(" + hoanthanh.length + ")"} key="4">Content of tab 4</TabPane>
          <TabPane tab={"Đã duyệt " + "(" + daduyet.length + ")"} key="5">Content of tab 5</TabPane>
          
        </Tabs>
  
        <Modal
          className={this.state.quaydau && "chuyenquaydau"}
          title={"Lệnh điều xe " + (this.state.quaydau ? "quay đầu" : "mới")}
          visible={this.state.visible}
          maskClosable={false}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="Đóng"
          cancelText="."
        >
          {this.state.visible &&
          <DO quaydau={this.state.quaydau}
              success={() => {
                this.hideModal()
                this.init()
              }}
          />}
        </Modal>
      </div>
    )
  }
  
  showModal1 = () => {
    this.setState({
      visible: true,
      quaydau: false,
    });
  }
  
  showModal2 = () => {
    this.setState({
      visible: true,
      quaydau: true
    });
  }
  
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
