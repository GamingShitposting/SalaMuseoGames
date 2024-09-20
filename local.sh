#!/bin/sh
cd "$( dirname "$( realpath "$0" )" )"

[ "$1" = "update" ] && \
	Message="$( [ -n "$2" ] && echo "$2" || cat .CommitMessage.txt )" && \
	git add . && git commit -m ": ${Message}" && git push

slug="$2"
date="$([ -n "$4" ] && echo "$4" || date "+%Y-%m-%d")"
mobyid="$3"
[ "$1" = "newpost" ] && ([ -n "${slug}" ] && (\
	mkdir -p "./assets/media/games/${slug}" && \
	echo "Add ${slug} [${date}]" > .CommitMessage.txt && \
	cat << [EOF] > "./_posts/${date}-${slug}.md"
---
layout: "post"
title: "$([ -n "${mobyid}" ] && curl --fail --location "https://www.mobygames.com/game/${mobyid}/" | grep '<meta property="og:title"' | cut -b36-)"
subtitle: ""
description: ""
image: "/assets/media/games/${slug}/"
image_source: "internal"
icon: "../../../../assets/media/games/${slug}/"
category: "games"
tags:
  - ""
author: "octobot"
mobygames_id: "${mobyid}"
software_data:
  backend: ""
  platform: ""
  core: ""
  rom_index: ""
  frame_url: ""
  frame_index: ""
  release:
    authors: ""
    region: ""
    source: ""
    type: ""
    year: ""
  screen:
    orientation: ""
    display:     ""
---

## About the game

<!-- [...] -->

## Resources

* Official page of the game; Cover image credits: <>

[EOF]
) || echo "Usage: $1 <slug> [mobygames id] [date]")
