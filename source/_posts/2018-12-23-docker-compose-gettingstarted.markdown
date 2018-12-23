---
layout: post
title: "Docker Compose入门"
date: 2018-12-23 13:48:43 +0800
comments: true
categories: docker
tags: [Docker,Compose]
statement: true
translate: true
originaltitle: "Get started with Docker Compose"
originalurl: https://docs.docker.com/compose/gettingstarted/
keywords: docker, Compose

---



    预计阅读时间：10分钟

在此页面上，您将构建一个在Docker Compose上运行的简单Python Web应用程序。该应用程序使用Flask框架并在Redis中维护一个命中计数器。虽然该示例使用Python，但即使您不熟悉它，此处演示的概念也应该是可以理解的。

## 预先准备

确保您已经安装了 [Docker Engine](https://docs.docker.com/install/) 和 [Docker Compose](https://docs.docker.com/compose/install/). 您不需要安装Python或Redis，因为两者都是由Docker镜像提供的。

<!-- more -->

## 第一步: Setup

定义应用程序依赖(dependencies).

1.  为项目创建一个目录:

        $ mkdir composetest
        $ cd composetest

2.  在项目目录中创建一个名为`app.py`的文件并粘贴如下:

        import time

        import redis
        from flask import Flask

        app = Flask(__name__)
        cache = redis.Redis(host='redis', port=6379)

        def get_hit_count():
            retries = 5
            while True:
                try:
                    return cache.incr('hits')
                except redis.exceptions.ConnectionError as exc:
                    if retries == 0:
                        raise exc
                    retries -= 1
                    time.sleep(0.5)

        @app.route('/')
        def hello():
            count = get_hit_count()
            return 'Hello World! I have been seen {} times.\n'.format(count)

        if __name__ == "__main__":
            app.run(host="0.0.0.0", debug=True)

    In this example, `redis` is the hostname of the redis container on the application’s network. We use the default port for Redis, `6379`.

    > Handling transient errors
    > 
    > Note the way the `get_hit_count` function is written. This basic retry loop lets us attempt our request multiple times if the redis service is not available. This is useful at startup while the application comes online, but also makes our application more resilient if the Redis service needs to be restarted anytime during the app’s lifetime. In a cluster, this also helps handling momentary connection drops between nodes.

3.  在项目目录中创建另一个名为`requirements.txt`的文件并粘贴如下:

        flask
        redis

## 第二步: 创建一个Dockerfile

在此步骤中，您将编写一个构建包含Python应用程序所需的所有依赖项，包括Python本身的Docker镜像的Dockerfile。

在项目目录中，创建一个名为`Dockerfile`的文件并粘贴以下内容：

    FROM python:3.4-alpine
    ADD . /code
    WORKDIR /code
    RUN pip install -r requirements.txt
    CMD ["python", "app.py"]

这里告诉Docker要做什么:

*   Build an image starting with the Python 3.4 image.
*   Add the current directory `.` into the path `/code` in the image.
*   Set the working directory to `/code`.
*   Install the Python dependencies.
*   Set the default command for the container to `python app.py`.

更多关于如何编写Dockerfiles的信息，请查看 [Docker user guide](https://docs.docker.com/engine/tutorials/dockerimages/#building-an-image-from-a-dockerfile) 和 [Dockerfile reference](https://docs.docker.com/engine/reference/builder/).

## 第三步: 在Compose文件中定义服务

在项目目录中创建一个名为`docker-compose.yml`的文件并粘贴以下内容:

    version: '3'
    services:
      web:
        build: .
        ports:
         - "5000:5000"
      redis:
        image: "redis:alpine"

这Compose文件定义了两个服务, `web` and `redis`. The `web` service:

*   Uses an image that’s built from the `Dockerfile` in the current directory.
*   Forwards the exposed port 5000 on the container to port 5000 on the host machine. We use the default port for the Flask web server, `5000`.

The `redis` service uses a public [Redis](https://registry.hub.docker.com/_/redis/) image pulled from the Docker Hub registry.

## 第四步: 使用Compose构建和运行您的应用程序

1.  从项目目录中，运行`docker-compose up`启动应用程序.

        $ docker-compose up
        Creating network "composetest_default" with the default driver
        Creating composetest_web_1 ...
        Creating composetest_redis_1 ...
        Creating composetest_web_1
        Creating composetest_redis_1 ... done
        Attaching to composetest_web_1, composetest_redis_1
        web_1    |  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
        redis_1  | 1:C 17 Aug 22:11:10.480 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
        redis_1  | 1:C 17 Aug 22:11:10.480 # Redis version=4.0.1, bits=64, commit=00000000, modified=0, pid=1, just started
        redis_1  | 1:C 17 Aug 22:11:10.480 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
        web_1    |  * Restarting with stat
        redis_1  | 1:M 17 Aug 22:11:10.483 * Running mode=standalone, port=6379.
        redis_1  | 1:M 17 Aug 22:11:10.483 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
        web_1    |  * Debugger is active!
        redis_1  | 1:M 17 Aug 22:11:10.483 # Server initialized
        redis_1  | 1:M 17 Aug 22:11:10.483 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
        web_1    |  * Debugger PIN: 330-787-903
        redis_1  | 1:M 17 Aug 22:11:10.483 * Ready to accept connections

    Compose pulls a Redis image, builds an image for your code, and starts the services you defined. In this case, the code is statically copied into the image at build time.

2.  在浏览器输入 `http://0.0.0.0:5000/` 查看应用运行情况.

    If you’re using Docker natively on Linux, Docker for Mac, or Docker for Windows, then the web app should now be listening on port 5000 on your Docker daemon host. Point your web browser to `http://localhost:5000` to find the `Hello World`message. If this doesn’t resolve, you can also try `http://0.0.0.0:5000`.

    If you’re using Docker Machine on a Mac or Windows, use `docker-machine ip MACHINE_VM` to get the IP address of your Docker host. Then, open `http://MACHINE_VM_IP:5000` in a browser.

    You should see a message in your browser saying:

        Hello World! I have been seen 1 times.

    ![hello world in browser](https://docs.docker.com/compose/images/quick-hello-world-1.png)

3.  刷新网页.

    The number should increment.

        Hello World! I have been seen 2 times.

    ![hello world in browser](https://docs.docker.com/compose/images/quick-hello-world-2.png)

4.  切换到另一个终端窗口，然后键入`docker image ls`列出本地图像.

    Listing images at this point should return `redis` and `web`.

        $ docker image ls
        REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
        composetest_web         latest              e2c21aa48cc1        4 minutes ago       93.8MB
        python                  3.4-alpine          84e6077c7ab6        7 days ago          82.5MB
        redis                   alpine              9d8fa9aa0e5b        3 weeks ago         27.5MB

    You can inspect images with `docker inspect <tag or id>`.

5.  通过在另一个终端在项目目录中运行`docker-compose down`, 或者在启动应用程序的终端中按CTRL + C 来停止应用程序.

## 第五步: 编辑Compose文件以添加绑定装载

编辑项目目录中的`docker-compose.yml`为`web`服务添加 [bind mount](https://docs.docker.com/engine/admin/volumes/bind-mounts/) :

    version: '3'
    services:
      web:
        build: .
        ports:
         - "5000:5000"
        volumes:
         - .:/code
      redis:
        image: "redis:alpine"

The new `volumes` key 把项目目录（当前目录）挂载到容器内的`/ code`允许您动态修改代码，而无需重建映像

## 第六步: 使用Compose Re-build并运行应用程序

在项目目录中，键入`docker-compose up`以使用更新的Compose文件构建应用程序，然后运行它。

    $ docker-compose up
    Creating network "composetest_default" with the default driver
    Creating composetest_web_1 ...
    Creating composetest_redis_1 ...
    Creating composetest_web_1
    Creating composetest_redis_1 ... done
    Attaching to composetest_web_1, composetest_redis_1
    web_1    |  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
    ...

Check the `Hello World` message in a web browser again, and refresh to see the count increment.

> Shared folders, volumes, and bind mounts
> 
> *   If your project is outside of the `Users` directory (`cd ~`), then you need to share the drive or location of the Dockerfile and volume you are using. If you get runtime errors indicating an application file is not found, a volume mount is denied, or a service cannot start, try enabling file or drive sharing. Volume mounting requires shared drives for projects that live outside of `C:\Users` (Windows) or `/Users` (Mac), and is required for _any_ project on Docker for Windows that uses [Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers-beta-feature). For more information, see [Shared Drives](https://docs.docker.com/docker-for-windows/#shared-drives) on Docker for Windows, [File sharing](https://docs.docker.com/docker-for-mac/#file-sharing) on Docker for Mac, and the general examples on how to [Manage data in containers](https://docs.docker.com/engine/tutorials/dockervolumes/).
>     
>     
> *   If you are using Oracle VirtualBox on an older Windows OS, you might encounter an issue with shared folders as described in this [VB trouble ticket](https://www.virtualbox.org/ticket/14920). Newer Windows systems meet the requirements for [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) and do not need VirtualBox.

## 第七步: 更新应用程序

由于应用程序代码现在使用卷安装到容器中，因此您可以更改其代码并立即查看更改，而无需重建映像.

1.  Change the greeting in `app.py` and save it. For example, change the `Hello World!` message to `Hello from Docker!`:

        return 'Hello from Docker! I have been seen {} times.\n'.format(count)

2.  Refresh the app in your browser. The greeting should be updated, and the counter should still be incrementing.

    ![hello world in browser](https://docs.docker.com/compose/images/quick-hello-world-3.png)

## 第八步: 尝试一些其他命令

如果你想在后台运行你的服务, 你可以在`docker-compose up`命令后面添加 `-d` (for “detached” mode)，使用`docker-compose ps`查看当前正在运行的内容:

    $ docker-compose up -d
    Starting composetest_redis_1...
    Starting composetest_web_1...

    $ docker-compose ps
    Name                 Command            State       Ports
    -------------------------------------------------------------------
    composetest_redis_1   /usr/local/bin/run         Up
    composetest_web_1     /bin/sh -c python app.py   Up      5000->5000/tcp

`docker-compose run`命令允许您为服务运行一次性命令。例如，查看`web`服务可用的环境变量:

    $ docker-compose run web env

可以通过`docker-compose --help`查看更多其他可用命令  . 您还可以为bash和zsh shell安装 [command completion](https://docs.docker.com/compose/completion/),以查看可用的命令.

如果您使用`docker-compose up -d`启动Compose，请在完成后停止服务:

    $ docker-compose stop

您可以使用`down`命令将所有内容放下，完全删除容器. 传递`--volumes`也可以删除Redis容器使用的数据挂载:

    $ docker-compose down --volumes

到这里, 您已经了解了Compose如何工作的基础知识.

## 接下来

*   Next, try the quick start guide for [Django](https://docs.docker.com/compose/django/), [Rails](https://docs.docker.com/compose/rails/), or [WordPress](https://docs.docker.com/samples/library/wordpress/)
*   [Explore the full list of Compose commands](https://docs.docker.com/compose/reference/)
*   [Compose configuration file reference](https://docs.docker.com/compose/compose-file/)
*   To learn more about volumes and bind mounts, see [Manage data in Docker](https://docs.docker.com/engine/admin/volumes/)

    documentation, docs, docker, compose, orchestration, containers
    
---

[markdown编辑](http://markdown.w3cub.com/)
