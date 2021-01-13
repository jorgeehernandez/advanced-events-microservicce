# Custom events microservice  

### Request structure  

https://{tenant}.{instance}.com/service/bsk-events-filters/events?{...params}  

### /events endpoint 

#### Available params
```js
    // type could be used as type_* and will retrieve all the events which his type match until "type_"
    {
        type: 'event type',
        dateFrom: '2018-01-16T18:38:44.466+01:00',
        dateTo: '2018-01-16T18:38:44.466+01:00',
        source: '12323',
        fragmentType: '',
        value: '',

    }
```
#### Expected response  
```js
    {
        [
        ...events
        ]

    }
```
