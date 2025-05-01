import { Redirect, router, Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View, Text, TVFocusGuideView, Image } from 'react-native';
import { BottomTabBarButtonProps, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { useAuth } from '@/store/authSlice';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/auth" />;
  }

  const tabBarButton = (props: BottomTabBarButtonProps) => {
    const style: any = props.style ?? {};
    return (
      <Pressable
        {...props}
        style={({ pressed, focused }) => [
          style,
          {
            opacity: pressed || focused ? 0.6 : 1.0,
            // borderWidth: pressed || focused ? 1 : 0,
            // borderColor: 'red',
            // paddingBottom: 100,
          },
        ]}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarPosition:
          Platform.isTV || Platform.OS === 'web' ? 'top' : 'bottom',
        headerShown: false,
      }}
      tabBar={Platform.isTV ? props => <MyTabBar {...props} /> : undefined}
      initialRouteName="index"
      >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton,
          // tabBarLabelStyle: textStyles.default,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'person' : 'person'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton,
          // tabBarLabelStyle: textStyles.default,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'film' : 'film'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tvshows"
        options={{
          title: 'TV Shows',
          tabBarButton,
          // tabBarLabelStyle: textStyles.default,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'tv-sharp' : 'tv-sharp'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          tabBarButton,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'library' : 'library'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// custom tabbar
function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  console.log('state', state);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(1);
  const focusedIndexRef = useRef<number>(1);
  // const lastFocusedIndexRef = useRef<number>(1); // start with the current active tab

  
  
  const onPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = (route: any) => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };


  const onFocus = (index: number, route: any) => {
    setFocusedIndex(index);
    // Navigate to that screen on focus
    // if(index !== 0) {
    // navigation.navigate(route.name, route.params);
    // }
    navigation.navigate(route.name, route.params);
  };  
  

  // const onFocus = (index: number, route: any) => {
  //   setFocusedIndex((prev) => {
  //     console.log('onFocus====', {prev, index});
  //     focusedIndexRef.current = prev!;
  //     // lastFocusedIndexRef.current = prev!;
  //     // if(prev !== index) {

  //     // }
  //     return index;
  //   });
  //   console.log('onFocus', {index, route});
  //   // lastFocusedIndexRef.current = index;
  //   navigation.navigate(route.name, route.params);
  // };

  // useEffect(() => {
  //   console.log('state.index======', state.index, focusedIndexRef.current);
  // }, [state.index]);


  return (
    <View style={{ 
      flexDirection: 'row',
      position: 'absolute',
      top: 10,
      left: 0,
      right: 0,
      zIndex: 1000,
      paddingVertical: 16,
      paddingHorizontal: 16,
       }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = focusedIndex === index;
        const isActive = state.index === index;


        return (
          <TVFocusGuideView           
          focusable={true} 
          onFocus={() => onFocus(index, route)} 

          style={{
            borderWidth: (isActive || isFocused) && index !== 0 ? 1 : 0, 
            borderColor: 'white',
            width:  index === 0 ? '25%' : '10%',
            backgroundColor: (isActive || isFocused) && index !== 0 ? 'white' : 'transparent',
            borderRadius: 10,
          }} 
          // onBlur={() => setFocusedIndex(null)} 
          key={index}
          >
          <Pressable
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={() => onPress(route, isFocused)}
            onLongPress={() => onLongPress(route)}
            style={{ 
              flex: 1,
              alignItems: index !== 0 ? 'center' : 'flex-start',
              justifyContent: 'center',


             }}
          >
         {index === 0 && <View 
         style={{

          borderWidth: isActive || isFocused ? 2 : 1,
          borderColor: 'white',
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
         }}

         
         >
          <Image source={{uri: 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png'}} style={{ width: 20, height: 20 }} />
         </View>}

            {index !== 0 && <Text style={{ color: isActive || isFocused ? 'black' : colors.text, fontSize: 20, textAlign: 'center', fontWeight: 'semibold',  }}>
              {label as string}
            </Text>}
          </Pressable>
          </TVFocusGuideView>
        );
      })}
    </View>
  );
}
