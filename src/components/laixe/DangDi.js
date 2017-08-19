import React from 'react';
import agent from '../../agent';
import {Link} from 'react-router'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  APP_LOAD
} from '../../constants/actionTypes';

import {Input, Button, Row, InputNumber, Modal, message} from 'antd'
import { Flex, WingBlank } from 'antd-mobile';


const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  xe: state.common.currentUser.xe,
  do: state.common.currentUser.do
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // onLoad: (tab, pager, payload) =>
  //   dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED }),
  reloadInfo: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
});

class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      init: false,
      data: {
        tienthu: 0,
        tienphatsinh: 0,
        lydo: ''
      },
      phatsinh: false,
      visible: false,
    }
  }
  componentWillMount() {
    let that = this;
    agent.LaiXe.DObyId(this.props.do)
      .then(res => {
        let DO = res[0]
        that.setState(prev => { return {
          ...prev,
          init: true,
          data: DO
        }})
      })
      .catch(err => {
      
      })
  }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    // console.log(e);
    // this.setState({
    //   visible: false,
    // });
    let that = this;
    agent.LaiXe.ketthucDO({do: this.props.do, tienthu: that.state.data.tienthu, tienphatsinh: that.state.data.tienphatsinh, lydo: that.state.data.lydo})
      .then(res => {
        message.success("Thành công")
        const token = window.localStorage.getItem('jwt');
        if (token) {
          agent.setToken(token);
        }
        this.props.reloadInfo(agent.Auth.current());
        this.context.router.replace('/laixe')
      })
      .catch(err => {
        message.error("Có lỗi")
      })
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page" style={{marginTop: '0.5rem'}}>
        <div style={{padding: '0.2em'}}>
          <h2 style={{color: 'red', fontSize: '1.2rem', textAlign: 'center'}}>DO{this.state.data._id + 10000}</h2>
          <Link to="/laixe/do/xem">
            <Button size={"large"} className="btn" style={{backgroundColor: 'grey !important' ,width: '100%', height: '2rem', fontSize: '1rem'}}>Xem chi tiết</Button>
          </Link>
        
          {/*<Link to="/laixe/danhsachdo">*/}
          <Button size={"large"} className="btn" type="primary" style={{width: '100%', marginTop: '0.3rem', height: '2rem', fontSize: '1rem'}}
            onClick={this.showModal}
          >Kết thúc</Button>
          {/*</Link>*/}
          
        </div>
  
        <Modal
          visible={this.state.visible}
          title="Kết thúc chuyến đi"
          maskClosable={true}
          // onOk={this.handleOk}
          // onCancel={this.handleCancel}
          footer={[
            <Button key="back" size="large" onClick={() => this.handleCancel()}>Quay lại</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.handleOk}>Xác nhận</Button>,
          ]}
        >
          <b style={{fontSize: '0.7rem'}}>Tiền thu hộ</b>
          <InputNumber style={{width: '100%'}} size="large"
                       defaultValue={0}
                       min={0}
                       formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                       parser={value => value.replace(/(,*)/g, '')}
                       onChange={(value) => {
                         if(!isNaN(parseFloat(value)) || value === '') {
                           this.setState(prev => {
                             return {
                               ...prev,
                               data: {
                                 ...prev.data,
                                 tienthu: value
                               }
                             }
                           })
                         } else {
                           this.setState(prev => {
                             return {
                               ...prev,
                               data: {
                                 ...prev.data,
                                 tienthu: 1
                               }
                             }
                           })
                         }
                       }}
          />
          { !this.state.phatsinh && <Button type="primary" ghost={true} style={{width: '3rem !important', fontSize: '0.4rem'}}
            onClick={() => {
              this.setState(prev => {return {
                ...prev,
                phatsinh: true
              }})
            }}
          >Phí phát sinh</Button>}
          
          {this.state.phatsinh && <div>
            <b style={{fontSize: '0.7rem'}}>Phí phát sinh</b>
            <InputNumber style={{width: '100%'}} size="large"
                         defaultValue={0}
                         min={0}
                         formatter={value => `${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                         parser={value => value.replace(/(,*)/g, '')}
                         onChange={(value) => {
                           if(!isNaN(parseFloat(value)) || value === '') {
                             this.setState(prev => {
                               return {
                                 ...prev,
                                 data: {
                                   ...prev.data,
                                   tienphatsinh: value
                                 }
                               }
                             })
                           } else {
                             this.setState(prev => {
                               return {
                                 ...prev,
                                 data: {
                                   ...prev.data,
                                   tienphatsinh: 1
                                 }
                               }
                             })
                           }
                         }}
            />
            <Input type="textarea" rows={4} style={{width: '100% !important', height: '3rem !important', lineHeight: '1rem', fontSize: '0.5rem'}}
              onChange={(value) => {
                this.setState(prev => {
                  return {
                    ...prev,
                    data: {
                      ...prev.data,
                      lydo: value
                    }
                  }
                })
                }}
            />
          </div>}
        </Modal>
        
      </div>
    );
  }
}


Home.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
