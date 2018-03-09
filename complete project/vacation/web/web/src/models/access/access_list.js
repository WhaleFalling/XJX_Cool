import React from 'react';
import { Button, Spin, Modal, Tree, Icon,message } from 'antd';
import Container from '../../component/container';
import fd from '../../base/fetchData';
import Create from './create_access';
import Edit from './edit_access';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            treeData: [],
            selectNodeKey: null,
            selectNodeData: null,
            loading: false,
            showEdit: false,
            showCreateFolder: false,
            showCreateChildren: false
        }
    }

    componentDidMount() {
        this.get_tree();
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
                <span className="folder_url">
                    {
                        `[菜单地址:${nodeData.url}]`
                    }
                </span>
                <Button
                    icon="file-add"
                    size="small"
                    shape="circle"
                    style={{}}
                    title="添加子节点"
                    onClick={() => this.handler_show_create_children()}
                ></Button>
                <Button
                    icon="edit"
                    size="small"
                    shape="circle"
                    style={{}}
                    title="编辑"
                    onClick={()=>this.handler_show_edit(nodeData)}
                ></Button>
                <Button
                    icon="delete"
                    size="small"
                    shape="circle"
                    style={{}}
                    title="删除"
                    onClick={() => {
                        Modal.confirm({
                            title: "确认操作",
                            content: "您确定要删除权限么？",
                            onOk: () => this.handler_remove(nodeData.access_id)
                        })
                    }}
                ></Button>
            </div>
        );
        /* 定义节点DOM */
        const LeafBar = () => (
            <div className="tree_title_bar">
                <span className="title">
                    {`${nodeData.access_name}`}
                </span>
                <span>
                    {`[接口地址：${nodeData.url}]`}
                </span>
                <Button
                    icon="edit"
                    size="small"
                    shape="circle"
                    style={{}}
                    title="编辑"
                    onClick={()=>this.handler_show_edit(nodeData)}
                ></Button>
                <Button
                    icon="delete"
                    size="small"
                    shape="circle"
                    style={{}}
                    title="删除"
                    onClick={() => {
                        Modal.confirm({
                            title: "确认操作",
                            content: "您确定要删除权限么？",
                            onOk: () => this.handler_remove(nodeData.access_id)
                        })
                    }}
                ></Button>
            </div>
        );

        return !!nodeData.node_type ? LeafBar() : FolderBar();
    }

    async handler_remove(id) {
        try {
            await fd.postJSON(fd.ports.admin.access.remove, { access_id: id });
            this.get_tree();
        } catch (e) {
            message.error(e.message);
        }
    }

    handler_remove_select(key, e) {
        var data = e.node.props.node_data;
        this.setState({
            selectNodeKey: key,
            selectNodeData: data
        });
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

    //弹出添加分类
    handler_show_create_folder() {
        this.setState({
            selectNodeKey: null,
            selectNodeData: null,
            showCreateFolder: true
        })
    }

    //弹出添加节点
    handler_show_create_children() {
        this.setState({
            showCreateChildren: true
        })
    }
    
    //修改节点
    handler_show_edit(nodeData){
        if(nodeData){
            this.setState({
                selectNodeKey:nodeData.access_id,
                selectNodeData:nodeData,
                showEdit:true
            });
        }else{
            this.setState({
                showEdit:true
            })
        }
    }

    render() {

        let isFolder = (!this.state.selectNodeData) || (this.state.selectNodeData.node_type !== 0);

        return (
            <div>
                <Container>
                    <div style={{ padding: 12 }}>
                        <Button.Group>
                            <Button
                                icon="folder-add"
                                onClick={() => this.handler_show_create_folder()}
                            >添加分类</Button>
                            <Button
                                icon="file-add"
                                disabled={isFolder}
                                onClick={() => this.handler_show_create_children()}
                            >添加节点</Button>
                        </Button.Group>

                        <Button.Group style={{ marginLeft: 50 }}>
                            <Button 
                                icon="edit"
                                disabled={isFolder}
                                onClick={()=>this.handler_show_edit()}
                            >修改</Button>
                            <Button 
                                icon="delete"
                                disabled={isFolder}
                            >删除</Button>
                        </Button.Group>
                    </div>
                </Container>
                <Container>
                    <Spin spinning={this.state.loading}>
                        <div style={{ overflow: 'hidden' }}>
                            <Tree
                                showLine
                                defaultExpandAll
                                onSelect={(key, e) => this.handler_remove_select(key, e)}
                            >
                                {
                                    this.state.treeData.map((v, k) => this.renderTreeNode(v))
                                }
                            </Tree>
                        </div>
                    </Spin>
                </Container>
                {
                    this.state.showCreateFolder && (
                        <Create
                            visible={this.state.showCreateFolder}
                            handler_refresh={() => this.get_tree()}
                            handler_close={() => this.setState({ showCreateFolder: false })}

                        />
                    )
                }
                {
                    this.state.showCreateChildren && (
                        <Create
                            visible={this.state.showCreateChildren}
                            handler_refresh={() => this.get_tree()}
                            handler_close={() => this.setState({ showCreateChildren: false })}
                            parentNodeData={this.state.selectNodeData}
                        />
                    )
                }
                {
                    this.state.showEdit && (
                        <Edit
                            visible={this.state.showEdit}
                            handler_refresh={() => this.get_tree()}
                            handler_close={() => this.setState({ showEdit: false })}
                            editRecord={this.state.selectNodeData}
                        />
                    )
                }
            </div>
        )
    }
}