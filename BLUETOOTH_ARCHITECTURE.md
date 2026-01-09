# 蓝牙功能架构文档

## 目录

- [概述](#概述)
- [架构设计](#架构设计)
- [文件结构](#文件结构)
- [核心模块](#核心模块)
- [数据流](#数据流)
- [API 接口](#api-接口)
- [使用示例](#使用示例)
- [配置说明](#配置说明)
- [扩展开发](#扩展开发)

---

## 概述

本小程序实现了基于蓝牙低功耗（BLE）的车辆控制功能，采用分层架构设计，将底层蓝牙通信与业务逻辑分离，便于维护和扩展。

### 主要功能

- ✅ 蓝牙设备扫描与连接
- ✅ 车辆启动/停止控制
- ✅ 车辆解锁/锁定控制
- ✅ 寻车功能
- ✅ 车辆状态查询
- ✅ 导航投屏功能

---

## 架构设计

### 分层架构

```
┌─────────────────────────────────────┐
│        页面层 (Pages)                │
│  - pages/index/index.js              │
│  - pages/bluetooth/connect/connect.js│
│  - pages/navigation/navigation.js   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      业务层 (Hooks)                  │
│  - features/bluetooth.js                │
│  (车辆控制指令封装)                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      服务层 (Services)                │
│  - services/bluetooth.js             │
│  (蓝牙底层服务类)                      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      微信API层                        │
│  - wx.openBluetoothAdapter()         │
│  - wx.startBluetoothDevicesDiscovery()│
│  - wx.createBLEConnection()          │
│  - wx.writeBLECharacteristicValue()  │
└─────────────────────────────────────┘
```

### 设计原则

1. **单一职责**：每层只负责自己的职责
2. **依赖倒置**：上层依赖下层，下层不依赖上层
3. **单例模式**：蓝牙服务使用单例，保证全局唯一连接
4. **事件驱动**：通过回调函数处理异步事件

---

## 文件结构

```
mini-program/
├── services/
│   └── bluetooth.js          # 蓝牙底层服务类（BluetoothService）
├── hooks/
│   └── bluetooth.js          # 业务层Hooks（车辆控制指令）
├── pages/
│   ├── index/
│   │   └── index.js          # 首页（使用蓝牙控制）
│   ├── bluetooth/
│   │   └── connect/
│   │       ├── connect.js    # 蓝牙连接页面
│   │       ├── connect.wxml  # 页面结构
│   │       └── connect.wxss  # 页面样式
│   └── navigation/
│       └── navigation.js     # 导航页面（蓝牙投屏）
└── BLUETOOTH_GUIDE.md        # 使用指南
```

---

## 核心模块

### 1. 服务层：`services/bluetooth.js`

**职责**：封装微信蓝牙API，提供底层蓝牙操作能力

**核心类：`BluetoothService`**

#### 主要属性

```javascript
{
  adapterState: false,        // 蓝牙适配器状态
  deviceId: null,             // 当前连接的设备ID
  serviceId: null,            // 服务UUID
  characteristicId: null,     // 特征UUID
  isConnected: false,         // 是否已连接
  devices: [],                // 扫描到的设备列表
  onDeviceFound: null,        // 设备发现回调
  onConnectionChange: null    // 连接状态变化回调
}
```

#### 主要方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `initAdapter()` | 初始化蓝牙适配器 | `Promise<boolean>` |
| `closeAdapter()` | 关闭蓝牙适配器 | `Promise<void>` |
| `startScan(options)` | 开始扫描设备 | `Promise<boolean>` |
| `stopScan()` | 停止扫描 | `Promise<void>` |
| `connectDevice(deviceId)` | 连接设备 | `Promise<boolean>` |
| `disconnectDevice()` | 断开连接 | `Promise<boolean>` |
| `writeData(data)` | 写入数据（发送指令） | `Promise<boolean>` |
| `readData()` | 读取数据 | `Promise<any>` |
| `stringToArrayBuffer(str)` | 字符串转ArrayBuffer | `ArrayBuffer` |
| `arrayBufferToString(buffer)` | ArrayBuffer转字符串 | `string` |

#### 关键实现

**设备过滤**

```javascript
isTargetDevice(device, options = {}) {
  const { deviceName, serviceUUIDs } = options;
  
  // 按设备名称过滤
  if (deviceName && device.name) {
    return device.name.includes(deviceName);
  }
  
  // 按服务UUID过滤
  if (serviceUUIDs && device.advertisServiceUUIDs) {
    return serviceUUIDs.some(uuid => 
      device.advertisServiceUUIDs.includes(uuid.toUpperCase())
    );
  }
  
  return true;
}
```

**数据转换**

```javascript
// 字符串 → ArrayBuffer（发送数据需要）
stringToArrayBuffer(str) {
  const buffer = new ArrayBuffer(str.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return buffer;
}

// ArrayBuffer → 字符串（接收数据需要）
arrayBufferToString(buffer) {
  const view = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < view.length; i++) {
    str += String.fromCharCode(view[i]);
  }
  return str;
}
```

---

### 2. 业务层：`features/bluetooth.js`

**职责**：封装车辆控制指令，提供业务友好的API

#### 指令定义

```javascript
const COMMANDS = {
  START: 'START',                    // 启动车辆
  STOP: 'STOP',                      // 停止车辆
  UNLOCK: 'UNLOCK',                  // 解锁
  LOCK: 'LOCK',                      // 锁定
  FIND: 'FIND',                      // 寻车
  STATUS: 'STATUS',                  // 查询状态
  NAVIGATION_START: 'NAV_START',     // 开始导航
  NAVIGATION_UPDATE: 'NAV_UPDATE',   // 更新导航
  NAVIGATION_STOP: 'NAV_STOP'        // 停止导航
};
```

#### 导出的函数

| 函数 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `initBluetooth()` | 初始化蓝牙 | - | `Promise<boolean>` |
| `scanVehicles(options)` | 扫描车辆 | `{deviceName, serviceUUIDs, onDeviceFound}` | `Promise<boolean>` |
| `stopScan()` | 停止扫描 | - | `Promise<void>` |
| `connectVehicle(deviceId)` | 连接车辆 | `deviceId: string` | `Promise<boolean>` |
| `disconnectVehicle()` | 断开连接 | - | `Promise<boolean>` |
| `startVehicleViaBluetooth()` | 启动车辆 | - | `Promise<{success, message}>` |
| `stopVehicleViaBluetooth()` | 停止车辆 | - | `Promise<{success, message}>` |
| `unlockVehicleViaBluetooth()` | 解锁车辆 | - | `Promise<{success, message}>` |
| `lockVehicleViaBluetooth()` | 锁定车辆 | - | `Promise<{success, message}>` |
| `findVehicleViaBluetooth()` | 寻车 | - | `Promise<{success, message}>` |
| `getVehicleStatusViaBluetooth()` | 查询状态 | - | `Promise<any>` |
| `startNavigationViaBluetooth(data)` | 开始导航投屏 | `navigationData: object` | `Promise<{success, message}>` |
| `updateNavigationViaBluetooth(data)` | 更新导航信息 | `navigationData: object` | `Promise<{success, message}>` |
| `stopNavigationViaBluetooth()` | 停止导航 | - | `Promise<{success, message}>` |
| `getBluetoothConnectionStatus()` | 获取连接状态 | - | `{isConnected, deviceId, serviceId, characteristicId}` |
| `getScannedDevices()` | 获取扫描到的设备 | - | `Array<Device>` |

#### 指令格式

所有指令统一使用JSON格式：

```javascript
{
  cmd: 'START',           // 指令类型
  timestamp: 1234567890,  // 时间戳
  data: {}                // 可选：附加数据
}
```

**示例：启动车辆**

```javascript
const command = JSON.stringify({
  cmd: COMMANDS.START,
  timestamp: Date.now()
});
```

**示例：导航投屏**

```javascript
const command = JSON.stringify({
  cmd: COMMANDS.NAVIGATION_START,
  data: {
    destination: {
      latitude: 39.908823,
      longitude: 116.397470,
      name: '目的地',
      address: '苏州市...'
    },
    route: [...],
    totalDistance: 5000,
    estimatedTime: 600
  },
  timestamp: Date.now()
});
```

---

### 3. 页面层

#### `pages/bluetooth/connect/connect.js`

**功能**：蓝牙设备扫描与连接页面

**主要方法**：

- `initPage()` - 初始化页面，检查蓝牙状态
- `startScanning()` - 开始扫描设备
- `stopScanning()` - 停止扫描
- `connectDevice(e)` - 连接选中的设备
- `disconnectDevice()` - 断开连接
- `refreshDevices()` - 刷新设备列表

**使用示例**：

```javascript
import { 
  initBluetooth, 
  scanVehicles, 
  connectVehicle 
} from '../../../features/bluetooth';

// 初始化
async initPage() {
  const success = await initBluetooth();
  if (success) {
    // 开始扫描
    await scanVehicles({
      deviceName: '首驱',
      onDeviceFound: (device) => {
        // 更新设备列表
      }
    });
  }
}
```

#### `pages/index/index.js`

**功能**：首页，集成蓝牙控制功能

**使用场景**：

- 快速解锁/锁定（优先使用蓝牙）
- 显示蓝牙连接状态
- 跳转到蓝牙连接页面

**使用示例**：

```javascript
import { 
  unlockVehicleViaBluetooth,
  getBluetoothConnectionStatus 
} from '../../features/bluetooth';

// 检查蓝牙状态
checkBluetoothStatus() {
  const status = getBluetoothConnectionStatus();
  this.setData({ bluetoothConnected: status.isConnected });
}

// 蓝牙解锁
async handleQuickUnlock() {
  const status = getBluetoothConnectionStatus();
  if (status.isConnected) {
    // 使用蓝牙解锁
    await unlockVehicleViaBluetooth();
  } else {
    // 使用网络解锁
    await vehicleStore.unlockVehicle();
  }
}
```

#### `pages/navigation/navigation.js`

**功能**：导航页面，支持蓝牙投屏

**使用场景**：

- 开始导航时，将导航信息投屏到车辆屏幕
- 导航过程中，定期更新导航信息
- 停止导航时，停止投屏

**使用示例**：

```javascript
import { 
  startNavigationViaBluetooth,
  updateNavigationViaBluetooth,
  stopNavigationViaBluetooth 
} from '../../services/bluetooth';

// 开始导航
async startNavigation() {
  const navigationData = {
    destination: this.data.destination,
    route: this.data.route,
    totalDistance: this.data.remainingDistance,
    estimatedTime: this.data.remainingTime
  };
  
  await startNavigationViaBluetooth(navigationData);
}

// 更新导航（定时调用）
async updateNavigation() {
  const updateData = {
    currentStep: this.data.currentStep,
    remainingDistance: this.data.remainingDistance,
    remainingTime: this.data.remainingTime,
    currentLocation: this.data.location,
    direction: 'straight',
    distance: 100
  };
  
  await updateNavigationViaBluetooth(updateData);
}
```

---

## 数据流

### 连接流程

```
1. 用户打开蓝牙连接页面
   ↓
2. 调用 initBluetooth() 初始化适配器
   ↓
3. 调用 scanVehicles() 开始扫描
   ↓
4. 设备发现回调 onDeviceFound(device)
   ↓
5. 用户选择设备，调用 connectVehicle(deviceId)
   ↓
6. BluetoothService.connectDevice(deviceId)
   ↓
7. wx.createBLEConnection() 建立连接
   ↓
8. 获取服务 getServices()
   ↓
9. 获取特征值 getCharacteristics()
   ↓
10. 连接成功，可以发送指令
```

### 指令发送流程

```
1. 业务层调用（如 unlockVehicleViaBluetooth()）
   ↓
2. 构建指令对象 {cmd: 'UNLOCK', timestamp: ...}
   ↓
3. JSON.stringify() 转换为字符串
   ↓
4. BluetoothService.writeData(data)
   ↓
5. stringToArrayBuffer() 转换为 ArrayBuffer
   ↓
6. wx.writeBLECharacteristicValue() 发送数据
   ↓
7. 车辆接收并执行指令
```

### 数据接收流程

```
1. 车辆发送数据
   ↓
2. wx.onBLECharacteristicValueChange() 触发
   ↓
3. 获取 ArrayBuffer 数据
   ↓
4. arrayBufferToString() 转换为字符串
   ↓
5. JSON.parse() 解析为对象
   ↓
6. 业务层处理数据
```

---

## API 接口

### 服务层 API

#### `BluetoothService.initAdapter()`

初始化蓝牙适配器。

```javascript
const success = await bluetoothService.initAdapter();
```

**返回值**：`Promise<boolean>`

---

#### `BluetoothService.startScan(options)`

开始扫描蓝牙设备。

```javascript
const success = await bluetoothService.startScan({
  deviceName: '首驱智能电动车',
  serviceUUIDs: ['0000FFE0-0000-1000-8000-00805F9B34FB']
});
```

**参数**：

- `options.deviceName` (string, 可选) - 设备名称过滤
- `options.serviceUUIDs` (Array<string>, 可选) - 服务UUID过滤
- `options.onDeviceFound` (function, 可选) - 设备发现回调

**返回值**：`Promise<boolean>`

---

#### `BluetoothService.connectDevice(deviceId)`

连接蓝牙设备。

```javascript
const success = await bluetoothService.connectDevice('device-id-123');
```

**参数**：

- `deviceId` (string) - 设备ID

**返回值**：`Promise<boolean>`

---

#### `BluetoothService.writeData(data)`

写入数据（发送指令）。

```javascript
const success = await bluetoothService.writeData('{"cmd":"START"}');
```

**参数**：

- `data` (string) - 要发送的数据（字符串）

**返回值**：`Promise<boolean>`

---

### 业务层 API

#### `unlockVehicleViaBluetooth()`

通过蓝牙解锁车辆。

```javascript
try {
  const result = await unlockVehicleViaBluetooth();
  console.log(result.message); // "解锁指令已发送"
} catch (error) {
  console.error(error.message);
}
```

**返回值**：`Promise<{success: boolean, message: string}>`

---

#### `startNavigationViaBluetooth(navigationData)`

开始导航投屏。

```javascript
const result = await startNavigationViaBluetooth({
  destination: {
    latitude: 39.908823,
    longitude: 116.397470,
    name: '目的地',
    address: '苏州市...'
  },
  route: [...],
  totalDistance: 5000,
  estimatedTime: 600
});
```

**参数**：

- `navigationData.destination` (object) - 目的地信息
- `navigationData.route` (Array) - 路线信息
- `navigationData.totalDistance` (number) - 总距离（米）
- `navigationData.estimatedTime` (number) - 预计时间（秒）

**返回值**：`Promise<{success: boolean, message: string}>`

---

## 使用示例

### 示例1：完整的连接流程

```javascript
import { 
  initBluetooth,
  scanVehicles,
  connectVehicle,
  getBluetoothConnectionStatus 
} from '../../features/bluetooth';

Page({
  data: {
    devices: [],
    connected: false
  },

  async onLoad() {
    // 1. 初始化蓝牙
    const initSuccess = await initBluetooth();
    if (!initSuccess) {
      wx.showToast({ title: '蓝牙初始化失败' });
      return;
    }

    // 2. 开始扫描
    await scanVehicles({
      deviceName: '首驱',
      onDeviceFound: (device) => {
        const devices = this.data.devices;
        const exists = devices.find(d => d.deviceId === device.deviceId);
        if (!exists) {
          devices.push(device);
          this.setData({ devices });
        }
      }
    });
  },

  async connectDevice(e) {
    const { deviceid } = e.currentTarget.dataset;
    
    // 3. 连接设备
    const success = await connectVehicle(deviceid);
    if (success) {
      // 4. 检查连接状态
      const status = getBluetoothConnectionStatus();
      this.setData({ connected: status.isConnected });
      wx.showToast({ title: '连接成功' });
    }
  }
});
```

### 示例2：蓝牙控制车辆

```javascript
import { 
  unlockVehicleViaBluetooth,
  lockVehicleViaBluetooth,
  getBluetoothConnectionStatus 
} from '../../features/bluetooth';

Page({
  async handleUnlock() {
    // 检查蓝牙连接
    const status = getBluetoothConnectionStatus();
    if (!status.isConnected) {
      wx.showToast({ title: '请先连接蓝牙' });
      return;
    }

    try {
      // 蓝牙解锁
      const result = await unlockVehicleViaBluetooth();
      wx.showToast({ title: result.message });
    } catch (error) {
      wx.showToast({ title: error.message });
    }
  }
});
```

### 示例3：导航投屏

```javascript
import { 
  startNavigationViaBluetooth,
  updateNavigationViaBluetooth,
  stopNavigationViaBluetooth 
} from '../../services/bluetooth';

Page({
  async startNavigation() {
    const navigationData = {
      destination: {
        latitude: 39.908823,
        longitude: 116.397470,
        name: '东方之门',
        address: '苏州市'
      },
      route: [
        { latitude: 39.9, longitude: 116.4, instruction: '直行100米' }
      ],
      totalDistance: 5000,
      estimatedTime: 600
    };

    try {
      await startNavigationViaBluetooth(navigationData);
      
      // 定时更新导航信息
      this.navTimer = setInterval(() => {
        this.updateNavigation();
      }, 5000);
    } catch (error) {
      wx.showToast({ title: error.message });
    }
  },

  async updateNavigation() {
    const updateData = {
      currentStep: 0,
      remainingDistance: 4500,
      remainingTime: 540,
      currentLocation: {
        latitude: 39.905,
        longitude: 116.395
      },
      direction: 'straight',
      distance: 100
    };

    await updateNavigationViaBluetooth(updateData);
  },

  async stopNavigation() {
    if (this.navTimer) {
      clearInterval(this.navTimer);
    }
    await stopNavigationViaBluetooth();
  }
});
```

---

## 配置说明

### 设备名称配置

在 `features/bluetooth.js` 中修改：

```javascript
export const scanVehicles = async (options = {}) => {
  const scanOptions = {
    deviceName: options.deviceName || '首驱智能电动车', // 修改这里
    serviceUUIDs: options.serviceUUIDs || []
  };
  // ...
};
```

### 服务UUID配置

如果车辆使用特定的服务UUID，可以在扫描时指定：

```javascript
await scanVehicles({
  serviceUUIDs: ['0000FFE0-0000-1000-8000-00805F9B34FB']
});
```

或在 `services/bluetooth.js` 的 `getServices()` 方法中指定：

```javascript
async getServices(deviceId) {
  // ...
  const targetService = services.find(s => 
    s.uuid === '0000FFE0-0000-1000-8000-00805F9B34FB' // 指定UUID
  );
  // ...
}
```

### 特征值UUID配置

在 `services/bluetooth.js` 的 `getCharacteristics()` 方法中指定：

```javascript
async getCharacteristics(deviceId) {
  // ...
  const writableChar = characteristics.find(c => 
    c.uuid === '0000FFE1-0000-1000-8000-00805F9B34FB' // 指定UUID
  );
  // ...
}
```

### 权限配置

在 `app.json` 中配置蓝牙权限：

```json
{
  "permission": {
    "scope.bluetooth": {
      "desc": "需要蓝牙权限以连接和控制车辆"
    }
  }
}
```

---

## 扩展开发

### 添加新指令

1. **在 `features/bluetooth.js` 中添加指令类型**：

```javascript
const COMMANDS = {
  // ... 现有指令
  SET_SPEED: 'SET_SPEED',  // 新指令
};
```

2. **添加对应的函数**：

```javascript
export const setVehicleSpeedViaBluetooth = async (speed) => {
  try {
    if (!bluetoothService.isConnected) {
      throw new Error('蓝牙未连接');
    }

    const command = JSON.stringify({
      cmd: COMMANDS.SET_SPEED,
      data: { speed },
      timestamp: Date.now()
    });

    await bluetoothService.writeData(command);
    return { success: true, message: '速度设置指令已发送' };
  } catch (error) {
    throw new Error('设置速度失败：' + error.message);
  }
};
```

3. **在页面中使用**：

```javascript
import { setVehicleSpeedViaBluetooth } from '../../features/bluetooth';

async handleSetSpeed() {
  await setVehicleSpeedViaBluetooth(30); // 设置速度30km/h
}
```

### 修改指令格式

如果需要修改指令格式（如使用二进制协议），修改 `features/bluetooth.js` 中的指令构建逻辑：

```javascript
// 示例：使用二进制格式
export const unlockVehicleViaBluetooth = async () => {
  // 构建二进制指令
  const buffer = new ArrayBuffer(4);
  const view = new Uint8Array(buffer);
  view[0] = 0x01; // 指令类型：解锁
  view[1] = 0x00; // 保留
  view[2] = 0x00; // 保留
  view[3] = 0x00; // 保留
  
  // 直接写入ArrayBuffer
  await bluetoothService.writeDataDirect(buffer);
  return { success: true, message: '解锁指令已发送' };
};
```

### 添加数据接收处理

在 `services/bluetooth.js` 中添加数据接收处理：

```javascript
// 在 readData() 方法中
async readData(deviceId = null) {
  // ... 现有代码
  
  // 监听数据接收
  wx.onBLECharacteristicValueChange((res) => {
    const value = this.arrayBufferToString(res.value);
    const data = JSON.parse(value);
    
    // 处理不同类型的数据
    if (data.type === 'STATUS') {
      this.onStatusReceived?.(data);
    } else if (data.type === 'ALERT') {
      this.onAlertReceived?.(data);
    }
    
    return value;
  });
}
```

---

## 注意事项

1. **连接状态管理**：蓝牙连接是全局的，确保在页面卸载时正确处理连接状态
2. **错误处理**：所有蓝牙操作都应该有错误处理，避免程序崩溃
3. **权限检查**：在使用蓝牙功能前，确保已获得用户授权
4. **设备过滤**：根据实际车辆配置设备名称或服务UUID，避免扫描到无关设备
5. **数据格式**：确保指令格式与车辆协议一致
6. **连接超时**：建议添加连接超时机制，避免长时间等待
7. **重连机制**：连接断开后，可以实现自动重连

---

## 故障排查

### 问题1：扫描不到设备

- 检查设备名称或服务UUID配置是否正确
- 检查车辆蓝牙是否开启
- 检查小程序蓝牙权限是否授权
- 尝试清除设备列表重新扫描

### 问题2：连接失败

- 检查设备是否已被其他设备连接
- 检查设备是否在有效范围内
- 查看控制台错误信息
- 尝试重新初始化蓝牙适配器

### 问题3：指令发送失败

- 检查蓝牙连接状态
- 检查服务UUID和特征值UUID是否正确
- 检查指令格式是否正确
- 查看控制台详细错误信息

### 问题4：数据接收异常

- 检查特征值是否支持通知（notify）
- 检查数据解析逻辑是否正确
- 检查ArrayBuffer转换是否正确

---

## 相关文档

- [BLUETOOTH_GUIDE.md](./BLUETOOTH_GUIDE.md) - 使用指南
- [微信小程序蓝牙API文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html)

---

## 更新日志

- **v1.0.0** (2024-01-XX)
  - 初始版本
  - 实现基础蓝牙连接功能
  - 实现车辆控制指令
  - 实现导航投屏功能
