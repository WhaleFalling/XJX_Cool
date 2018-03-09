import React from 'react';
import {  Spin, Modal, Tree, Icon, message } from 'antd';
import fd from '../../base/fetchData';

class Set extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            loading: false,
            submitting:false,
            select_key:props.editRecord.access_list?props.editRecord.access_list.split(","):[],
            treeData: []
        }
    }

    componentDidMount() {
        this.get_tree();
    }

    //显隐弹层
    handler_show() {
        this.setState({
            visible: true
        })
    }
    handler_hidden() {
        this.setState({
            visible: false
        })
    }
    handler_remove_select(key, e) {
        var data = e.node.props.node_data;
        this.setState({
            selectNodeKey: key,
            selectNodeData: data
        });
    }

    async get_tree() {
        try {
            this.setState({ loading: true })
            let list = await fd.getJSON(fd.ports.admin.access.list);
            if (list.length) {
                this.setState({ treeData: this.formatTree(list) });
            } else {
                this.setState({ treeData: [] });
            }
        } catch (e) {
            message.error(e.message);
        } finally {
            this.setState({ loading: false });
        }
    }

    renderTreeNodeBar(nodeData) {
        //定义分类节点Demo
        const FolderBar = () => (
            <div className="tree_title_bar">
                <span className="">
                    <Icon type="folder" />
                    {
                        `${nodeData.access_name}[${nodeData.children.length}]`
                    }
                </span>
            </div>
        );
        /* 定义节点DOM */
        const LeafBar = () => (
            <div className="tree_title_bar">
                <span className="title">
                    {`${nodeData.access_name}`}
                </span>
            </div>
        );

        return !!nodeData.node_type ? LeafBar() : FolderBar();
    }

    formatTree(list) {
        const findChildren = (parent_id) => {
            let children = [];
            for (let item of list) {
                if (item.parent_id === parent_id) {
                    children.push(item);
                }
            }
            return children;
        }

        let tree = [];
        for (let f of list) {
            if (f.node_type === 0) {
                let folder = Object.assign({}, f);
                folder.children = findChildren(folder.access_id);
                tree.push(folder);
            }
        }
        return tree;
    }

    renderTreeNode(nodeData) {
        return (
            <Tree.TreeNode
                title={this.renderTreeNodeBar(nodeData)}
                key={nodeData.access_id}
                node_data={nodeData}
            >
                {
                    !!nodeData.children && nodeData.children.map((v, k) => {
                        return this.renderTreeNode(v);
                    })
                }
            </Tree.TreeNode>
        )
    }

    handler_tree_check(keys){
        this.setState({select_key:keys})
    }

    async handler_submit(){
        try{
            const postData = Object.assign({},this.props.editRecord);
            postData.access_list = this.state.select_key.join(",");
            this.setState({submitting:true});
            await fd.postJSON(fd.ports.admin.role.update,postData);
            this.props.handler_refresh();
            this.handler_hidden();
        }catch(e){
            message.error(e.message);
        }finally{
            this.setState({submitting:false});
        }
        
    }

    render() {

        return (
            <Modal
                title="编辑角色"
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                afterClose={() => this.props.handler_close()}
                onOk={()=>this.handler_submit()}
                confirmLoading={this.state.submitting}
            >
                <Spin spinning={this.state.loading}>
                    <div style={{ overflow: 'hidden' }}>
                        { !!this.state.treeData.length && <Tree
                            checkable
                            showLine
                            onCheck={this.handler_tree_check.bind(this)}
                            defaultExpandAll
                            checkedKeys={this.state.select_key}
                            onSelect={(key, e) => this.handler_remove_select(key, e)}
                            
                        >
                            {
                                this.state.treeData.map((v, k) => this.renderTreeNode(v))
                            }
                        </Tree>}
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default Set;