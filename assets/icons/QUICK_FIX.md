# 快速修复图标缺失问题

## 最快解决方案：使用在线占位符

访问以下链接，直接下载占位图标（点击链接后右键保存图片）：

### TabBar图标（81x81）

- [home.png](https://via.placeholder.com/81x81/1a1a1a/ffffff?text=HOME)
- [home-active.png](https://via.placeholder.com/81x81/07c160/ffffff?text=HOME)
- [trip.png](https://via.placeholder.com/81x81/1a1a1a/ffffff?text=TRIP)
- [trip-active.png](https://via.placeholder.com/81x81/07c160/ffffff?text=TRIP)
- [community.png](https://via.placeholder.com/81x81/1a1a1a/ffffff?text=COMM)
- [community-active.png](https://via.placeholder.com/81x81/07c160/ffffff?text=COMM)
- [profile.png](https://via.placeholder.com/81x81/1a1a1a/ffffff?text=USER)
- [profile-active.png](https://via.placeholder.com/81x81/07c160/ffffff?text=USER)

### 功能图标（48x48）

- [unlock.png](https://via.placeholder.com/48x48/07c160/ffffff?text=🔓)
- [lock.png](https://via.placeholder.com/48x48/fa5151/ffffff?text=🔒)
- [start.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=▶)
- [stop.png](https://via.placeholder.com/48x48/ff9500/ffffff?text=⏹)
- [find.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🔍)
- [control.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🎮)
- [status.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=📊)
- [battery.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🔋)
- [settings.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=⚙)
- [headlight.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=💡)
- [cruise.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🚗)
- [seat.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🪑)
- [map.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🗺)
- [marker.png](https://via.placeholder.com/40x40/fa5151/ffffff?text=📍)
- [location-start.png](https://via.placeholder.com/32x32/07c160/ffffff?text=●)
- [location-end.png](https://via.placeholder.com/32x32/fa5151/ffffff?text=●)
- [store.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🏪)
- [repair.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🔧)
- [list.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=📋)
- [vehicle.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🛵)
- [about.png](https://via.placeholder.com/48x48/1a1a1a/ffffff?text=ℹ)
- [avatar-default.png](https://via.placeholder.com/120x120/e5e5e5/999999?text=👤)

## 使用步骤

1. **逐个下载图标**
   - 点击上方链接
   - 右键点击图片
   - 选择"图片另存为"
   - 保存到 `assets/icons/` 目录
   - 确保文件名完全一致

2. **或者使用命令行批量下载**（Mac/Linux）

```bash
cd assets/icons

# 下载TabBar图标
curl -o home.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=HOME"
curl -o home-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=HOME"
curl -o trip.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=TRIP"
curl -o trip-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=TRIP"
curl -o community.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=COMM"
curl -o community-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=COMM"
curl -o profile.png "https://via.placeholder.com/81x81/1a1a1a/ffffff?text=USER"
curl -o profile-active.png "https://via.placeholder.com/81x81/07c160/ffffff?text=USER"

# 下载功能图标
curl -o unlock.png "https://via.placeholder.com/48x48/07c160/ffffff?text=🔓"
curl -o lock.png "https://via.placeholder.com/48x48/fa5151/ffffff?text=🔒"
curl -o start.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=▶"
curl -o stop.png "https://via.placeholder.com/48x48/ff9500/ffffff?text=⏹"
curl -o find.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🔍"
curl -o control.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🎮"
curl -o status.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=📊"
curl -o battery.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🔋"
curl -o settings.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=⚙"
curl -o headlight.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=💡"
curl -o cruise.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🚗"
curl -o seat.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🪑"
curl -o map.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🗺"
curl -o marker.png "https://via.placeholder.com/40x40/fa5151/ffffff?text=📍"
curl -o location-start.png "https://via.placeholder.com/32x32/07c160/ffffff?text=●"
curl -o location-end.png "https://via.placeholder.com/32x32/fa5151/ffffff?text=●"
curl -o store.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🏪"
curl -o repair.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🔧"
curl -o list.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=📋"
curl -o vehicle.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=🛵"
curl -o about.png "https://via.placeholder.com/48x48/1a1a1a/ffffff?text=ℹ"
curl -o avatar-default.png "https://via.placeholder.com/120x120/e5e5e5/999999?text=👤"
```

3. **验证文件**
```bash
ls -la assets/icons/
# 应该看到所有图标文件
```

## 更好的解决方案：使用真实图标

占位图标仅用于开发测试，生产环境建议使用真实图标：

1. 访问 [iconfont](https://www.iconfont.cn/)
2. 搜索并下载所需图标
3. 统一图标风格和尺寸
4. 替换占位图标

## 注意事项

- 确保文件名与代码中引用的完全一致
- 图标路径使用绝对路径 `/assets/icons/xxx.png`
- TabBar图标建议提供@2x和@3x版本以适配不同设备
