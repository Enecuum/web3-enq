# о библиотеке
она необходима для взаимодействия с расширением. рабочие библиотеки временно в папке ```./prebuild```

# начало работы 
 - подключи библиотеку к странице как скрипт, можно как ```cdn``` 
 - в консоли появится объект ```ENQweb3lib``` с методами:
   - .connect()
   - .enable( obj ) 
   - .balanceOf( obj )
   - .sendTransaction( obj )
   - .net.getProvider()
    
# методы 
### connect()
необходим, чтобы начать работы с расширением. хочешь спросить что-то у расширения - вызови connect() в начале работы страницы, вызывается 1 раз
### async enable()
возвращает публичный ключ, функция асинхронная! используй await
```
let answer = await Enecuum.enable()
```
в `answer` будут следующие данные:
```
{
   pubkey:'examleHash',
   net:'http://example.com'
}
```
### async balanceOf( obj ) 
```
let answer = await Enecuum.balanceOf(obj)
```
функция возвращает баланс аккаунта по токену. в ```obj``` входит:
 ``` 
 {
   to:string,  - публичный ключ аккаунта
   tokenHash:string    - токен
 } 
 ```

### async sendTransaction( obj ) 
отправляет запрос на отправку транзакции.
```
let answer = await Enecuum.sendTransaction(obj)
```
в obj входит:
```
{
  from:string, - публичный адрес отправителя
  to:string,  - публичный адрес получателя
  value:BigInt, - количество монет 
  tokenHash:string, - токен монетки
  nonce:number,  - опционально( Math.floor(Math.random() * 1e10) )
  data:JSON.stringify(obj), - опционально. данные ( можно передать привет )
  net:string - опционально, для свопа. передавать url. без последнего слеша https://example.com
}
```

### async net.getProvider()
отправляет запрос сети в которой сейчас работает аккаунт. пользователь может менять сеть аккаунта. Не требует подтвержения 
```
let answer = await Enecuum.net.getProvider()
```
в `answer` будут следующие данные:
```
{
   net:'http://example.com'
}
```