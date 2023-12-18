#!/bin/sh
cd "$( dirname "$( realpath "$0" )" )"

[ "$1" == "update" ] && git add . && git commit -m ": $2" && git push

[ "$1" == "newpost" ] && [ -n "$2" ] && [ -n "$3" ] && mkdir -p "./assets/media/games/$2" cat << [EOF] > "./_posts/$3$2.md"
---
layout: "post"
title: ""
subtitle: ""
description: ""
image: "/assets/media/games/$2/"
image_source: "internal"
category: "games"
tags:
  - ""
author: "octobot"
software_data:
  platform   : ""
  rom_index  : ""
  release    :
    region   : ""
    source   : ""
    type     : ""
---

## About the game



## Try it!

{% include software-embed.html %}

## Resources

* Official page of the game; Cover image credits: <>

[EOF]