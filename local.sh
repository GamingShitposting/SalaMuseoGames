#!/bin/sh
cd "$( dirname "$( realpath "$0" )" )"

[ "$1" = "update" ] && \
	Message="$( [ -n "$2" ] && echo "$2" || cat .CommitMessage.txt )" && \
	git add . && git commit -m ": ${Message}" && git push

[ "$1" = "newpost" ] && [ -n "$2" ] && [ -n "$3" ] && \
	mkdir -p "./assets/media/games/$2" && \
	echo "Add $2 [$3]" > .CommitMessage.txt && \
	cat << [EOF] > "./_posts/$3-$2.md"
---
layout: "post"
title: "$([ -n "$4" ] && curl -L "https://www.mobygames.com/game/$4/" | grep '<meta property="og:title"' | cut -b36-)"
subtitle: ""
description: ""
image: "/assets/media/games/$2/"
image_source: "internal"
icon: "../../../../assets/media/games/$2/"
category: "games"
tags:
  - ""
author: "octobot"
mobygames_id: "$4"
software_data:
  platform: ""
  frame_url: ""
  frame_index: ""
  release:
    region: ""
    source: ""
    type:   ""
  screen:
    orientation: ""
    display:     ""
---

## About the game

<!-- [...] -->

## Resources

* Official page of the game; Cover image credits: <>

[EOF]
