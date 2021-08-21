# react-navigation 的使用

## 依赖包

```
    "@react-navigation/native": "^6.0.2",
    "@react-navigation/native-stack": "^6.1.0",
    "react-native-safe-area-context": "^3.3.0",
    "react-native-screens": "^3.5.0"
```
## 基本使用

```
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

<NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Overview' }}
    />
    <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
</NavigationContainer>

```
创建一个导航器栈，配置导航器栈的中的路由

一些参数的配置
`Stack.Navigator` 配置 `initialRouteName` 初始路由
`tack.Screen`中的 `options` 配置路由的一些参数

额外的参数传递的组件的方案
1. Use React context and wrap the navigator with a context provider to pass data to the screens (recommended).
2. Use a render callback for the screen instead of specifying a component prop:
```
<Stack.Screen name="Home">
  {props => <HomeScreen {...props} extraData={someData} />}
</Stack.Screen>
```
## 导航之间的调整

### 跳转到一个新的screen
```
onPress={() => navigation.navigate('Details')}
```
### Navigate to a route multiple times 跳转到一个路由多次
```
navigation.navigate('Details')
```
已经在Detail的页面，不会再次跳转

```
navigation.push('Details');
```
这个时候会再次增加一个Detail页
### 返回

```
navigation.navigate('home')
```

```
navigation.goBack()
```

### 总结
navigation.navigate('RouteName') pushes a new route to the native stack navigator if it's not already in the stack, otherwise it jumps to that screen.
We can call navigation.push('RouteName') as many times as we like and it will continue pushing routes.
The header bar will automatically show a back button, but you can programmatically go back by calling navigation.goBack(). On Android, the hardware back button just works as expected.
You can go back to an existing screen in the stack with navigation.navigate('RouteName'), and you can go back to the first screen in the stack with navigation.popToTop().
The navigation prop is available to all screen components (components defined as screens in route configuration and rendered by React Navigation as a route).

## 将参数传递给路由
There are two pieces to this:

1. Pass params to a route by putting them in an object as a second parameter to the navigation.navigate function: navigation.navigate('RouteName', { /* params go here */ })

2. Read the params in your screen component: route.params.

### Updating params
```
navigation.setParams({
  query: 'someText',
});
```
> 注意：避免setParams用于更新屏幕选项等title。如果您需要更新选项，请setOptions改用。
### 初始参数
```
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  initialParams={{ itemId: 42 }}
/>
```
### 将参数传递给上一个屏幕

### Passing params to nested navigators

```
navigation.navigate('Account', {
  screen: 'Settings',
  params: { user: 'jane' },
});
```
## Configuring the header bar

### Using params in the title
```
options={({ route }) => ({ title: route.params.name })}
```
### Updating options with setOptions
```
/* Inside of render() of React class */
<Button
  title="Update the title"
  onPress={() => navigation.setOptions({ title: 'Updated!' })}
/>
```
### Adjusting header styles

### Sharing common options across screens 通用 options 的共享
```
function StackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}
```
### Replacing the title with a custom component 自定义组件代替 标题

```
options={{ headerTitle: props => <LogoTitle {...props} /> }}
```

## Header buttons

```
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#fff"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
```
### 标题与其屏幕组件的交互
```
 const [count, setCount] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount(c => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);
```

### Customizing the back button
### Overriding the back button

## Nesting navigators

### 嵌套导航器如何影响行为

#### 每个导航器都有自己的导航历史
#### 每个导航器都有自己的选项
#### 导航器中的每个屏幕都有自己的参数
#### 导航操作由当前导航器处理，如果无法处理则冒泡
#### 导航器特定的方法在嵌套在其中中的导航器中可用

```
navigation.navigate('Root', {
  screen: 'Settings',
  params: {
    screen: 'Sound',
    params: {
      screen: 'Media',
    },
  },
});
```
### 嵌套导航器的最佳实践
尽量减少
```
<Stack.Navigator>
  {isLoggedIn ? (
    // Screens for logged in users
    <Stack.Group>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Group>
  ) : (
    // Auth screens
    <Stack.Group screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Group>
  )}
  {/* Common modal screens */}
  <Stack.Group screenOptions={{ presentation: 'modal' }}>
    <Stack.Screen name="Help" component={Help} />
    <Stack.Screen name="Invite" component={Invite} />
  </Stack.Group>
</Stack.Navigator>
```

## Navigation lifecycle