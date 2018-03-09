//路由引入
import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';

//功能性组件
import NotFound from './component/NotFound';
//业务组件
import ClassRoom from './models/class_room/class_room_list';
import Lesson from './models/lesson/lesson_list';
import Major from './models/major/major_list';
import Class from './models/class/class_list';
import Student from './models/student/student_list';
import Schedule from './models/lesson_schedule/schedule';
//权限组件
import Access from './models/access/access_list';
import Role from './models/role/role_list';
import User from './models/user/user_list';

export default () => (
    <Switch>
        {/* 教室管理 */}
        <Route path="/room" component={ClassRoom} />
        {/* 课程管理 */}
        <Route path="/lesson" component={Lesson} />
        {/* 专业管理 */}
        <Route path="/major" component={Major} />
        {/* 班级管理 */}
        <Route path="/class" component={Class} />
        {/* 学生管理 */}
        <Route path="/student" component={Student} />
        {/* 课程表 */}
        <Route path="/schedule" component={Schedule} />
        {/* 权限管理 */}
        <Route path="/system/access" component={Access} />
        {/* 角色管理 */}
        <Route path="/system/roles" component={Role} />
        {/* 用户管理 */}
        <Route path="/system/users" component={User}/>
        {/* 404界面 */}
        <Route component={NotFound} />
    </Switch>
);