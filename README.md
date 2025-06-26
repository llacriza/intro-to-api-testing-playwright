| Command | Description                                         |
|---------|-----------------------------------------------------|
| put     | Put request with correct data - code 200            |
| put     | Put order request with incorrect data - code 400    |
| delete  | Delete order request with correct data- code 204    |
| delete  | Delete order request with incorrect data - code 400 | 
| get     | Get order request with correct id - code 200        |
| get     | Get order request with incorrect id - code 400      |

Risk credit API service soft assert response body dto -HW10

| Command | Description                                           |
|---------|-------------------------------------------------------|
| post    | Risk decision negative very high risk - code 200      |
| post    | Risk decision positive low risk - code 200            |
| post    | Risk decision positive medium risk - code 200         |
| post    | Risk decision all data 0 - code 400                   |
| post    | Risk decision data income,debt 0 - code 400           |
| post    | Risk decision positive data employed false - code 200 |
| post    | Risk decision positive - unknown risk - code 200      |
| post    | Risk decision error link path -  code 405             |
| post    | Risk decision negative loan is 0 - code 400           |
| put     | Risk decision put request -  code 404                 |

