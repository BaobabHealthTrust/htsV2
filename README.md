# HIV Testing Services (HTS)

The project backend API is generated by [LoopBack](http://loopback.io) while the frontend was built using [React](https://reactjs.org).

## Setup

To run the application, 
1. Install [Node.js](https://nodejs.org/) version 8.10.0 or any greater stable version
2. Install git
3. Clone the module onto your local machine
    ```
        cd /var/www
        git clone https://github.com/BaobabHealthTrust/htsV2
    ```
4. Install [Elasticsearch](https://www.elastic.co/products/elasticsearch) 
5. Create configuration files in the *configs/* folder. That is, for each *.example* file, copy file and create a *.json* file then fill in the required data based on the fields
6. Install application dependencies by running the command
    ``` 
        npm install --save --verbose && npm install pm2 -g --verbose
    ```
7. Install [Redis](https://redis.io/download)
8. To run the application, execute
    ```
        ./start.sh
    ```
9. To automatically start the application on reboot, run the following command and follow the instructions:
    ```
        pm2 startup
    ```


## License

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this library; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA.