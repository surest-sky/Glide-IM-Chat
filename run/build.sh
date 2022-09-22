#!/bin/bash

if [ $1 == "build" ]; then
  if [ $1 == "pc" ]; then
    npm run build
    tar -cJvf pc.tar.xz build
    echo "编译完成 PC"
    exit 1
  fi

  if [ $1 == "mobile" ]; then
    npm run build
    tar -cJvf mobile.tar.xz build
    echo "编译完成 Mobile"
    exit 1
  fi

  echo "未找到需要编译的服务"
  exit 1
fi

if [ $1 == "deploy" ]; then
  if [ $1 == "pc" ]; then
    rm -rf ./pc
    tar -xf pc.tar.xz
    echo "部署成功 PC"
    exit 1
  fi

  if [ $1 == "mobile" ]; then
    rm -rf ./mobile
    tar -xf mobile.tar.xz
    echo "部署成功 PC"
    exit 1
  fi

  echo "未找到需要部署的服务"
  exit 1
fi

