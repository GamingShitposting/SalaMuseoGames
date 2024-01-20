#!/bin/sh
cd "$( dirname "$( realpath "$0" )" )"

[ "$1" = "update" ] && \
	Message="$( [ -n "$2" ] && echo "$2" || cat .CommitMessage.txt )"
	git add . && git commit -m ": ${Message}" && git push

[ "$1" = "newpost" ] && [ -n "$2" ] && [ -n "$3" ] && \
	mkdir -p "./assets/media/games/$2" && \
	echo "Add $2 [$3]" > .CommitMessage.txt && \
	cat << [EOF] > "./_posts/$3-$2.md"
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
