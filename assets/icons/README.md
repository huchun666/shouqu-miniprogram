# 图标资源说明

本目录用于存放小程序所需的图标资源文件。

## 所需图标列表

### TabBar 图标（需要2种状态：普通和选中）
- `home.png` / `home-active.png` - 首页图标
- `trip.png` / `trip-active.png` - 行程图标
- `community.png` / `community-active.png` - 社区图标
- `profile.png` / `profile-active.png` - 个人中心图标

### 功能图标
- `unlock.png` - 解锁图标
- `lock.png` - 锁定图标
- `start.png` - 启动图标
- `stop.png` - 停止图标
- `find.png` - 寻车图标
- `control.png` - 控制图标
- `status.png` - 状态图标
- `battery.png` - 电池图标
- `settings.png` - 设置图标
- `headlight.png` - 大灯图标
- `cruise.png` - 定速巡航图标
- `seat.png` - 坐垫图标
- `map.png` - 地图图标
- `marker.png` - 地图标记图标
- `location-start.png` - 起点图标
- `location-end.png` - 终点图标
- `store.png` - 服务网点图标
- `repair.png` - 报修图标
- `list.png` - 列表图标
- `vehicle.png` - 车辆图标
- `about.png` - 关于图标
- `avatar-default.png` - 默认头像

## 图标规格建议

- **TabBar图标**：建议 81px × 81px，支持@2x和@3x
- **功能图标**：建议 48px × 48px 或 64px × 64px
- **格式**：PNG格式，支持透明背景
- **颜色**：建议使用单色图标，可通过CSS调整颜色

## 获取图标的方式

### 方式1：使用图标库（推荐）
1. 访问 [iconfont](https://www.iconfont.cn/) 或 [Icons8](https://icons8.com/)
2. 搜索并下载所需图标
3. 统一图标风格和尺寸

### 方式2：使用小程序内置图标
可以使用微信小程序提供的图标字体，需要修改代码使用字体图标

### 方式3：临时占位方案
在开发阶段，可以使用简单的占位图片或纯色方块

## 快速生成占位图标

如果需要快速生成占位图标用于开发测试，可以使用以下方法：

1. 使用在线工具生成：https://placeholder.com/
2. 使用图片编辑软件创建简单的图标
3. 使用命令行工具（如ImageMagick）批量生成

## 注意事项

- 图标文件名必须与代码中引用的路径完全一致
- 图标建议使用SVG格式转换为PNG，保证清晰度
- TabBar图标建议使用2倍图和3倍图以适配不同设备
- 图标颜色建议使用主题色，保持视觉统一
