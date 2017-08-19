import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import Avatar from '../_components/Avatar'

import { Button, DatePicker, Table, Timeline, Icon, Row, Col, Input, Modal, Card, message, Select, Radio} from 'antd';
import moment from 'moment'

const { Column, ColumnGroup } = Table;


const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
 
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      data: {
        mien: 'bac'
      },
      phongban: []
    }
    this.init()
  }
  
  init = () => {
    let that = this;
    agent.NhanSu.tatCaPhongBan()
      .then(res => {
        that.setState({phongban: res})
        console.log(that.state)
      })
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  
  handleSizeChange = (e) => {
    let value = e.target.value
    this.setState(prev => {
      return {
        ...prev,
        data: {
          ...prev.data,
          mien: value
        }
      }
    })
    
  }
  
  themMoi = () => {
    let that = this;
  
    agent.NhanSu.themPhongBan(this.state.data)
      .then(res => {
        that.init()
      })
    
    this.setState({
      visible: false,
    });
  }
  
  render() {
    console.log(this.state.phongban)
    return (
      <div className="home-page" style={{padding: 10, marginTop: 10}}>
        <Button type="primary" onClick={this.showModal}>Thêm mới</Button>
  
        <hr/>
        
        <Table dataSource={this.state.phongban} columns={columns} />
        
        <Modal
          title="Thêm phòng/ban mới"
          visible={this.state.visible}
          onOk={this.themMoi}
          onCancel={this.hideModal}
          okText="Thêm mới"
          cancelText="Đóng"
        >
          <Input placeholder="Tên"
                 onChange={(e) => {
                   let value = e.target.value
                   this.setState(prev => {
                     return {
                       ...prev,
                       data: {
                         ...prev.data,
                         ten: value
                       }
                     }
                   })}}
          />
          <Input placeholder="Mã"
                 onChange={(e) => {
                   let value = e.target.value
                   this.setState(prev => {
                     return {
                       ...prev,
                       data: {
                         ...prev.data,
                         ma: value
                       }
                     }
                 })}}
          />
          
          <Radio.Group value={this.state.data.mien} onChange={this.handleSizeChange}>
            <Radio.Button value="bac">Miền bắc</Radio.Button>
            <Radio.Button value="nam">Miền nam</Radio.Button>
          </Radio.Group>
        </Modal>
        
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const columns = [{
  title: 'Tên phòng/ban',
  dataIndex: 'ten',
  key: 'ten',
}, {
  title: 'Mã phòng/ban',
  dataIndex: 'ma',
  key: 'ma',
}, {
  title: 'Miền',
  dataIndex: 'mien',
  key: 'mien',
}];