import ScriptAPI from '../../src/core/engines/ScriptAPI'

test('Test ScriptAPI() >  Roundtrip', async () => {

    let app = {
        "version": 2.1,
        "screens": {
            's1': {
                id: 's1',
                name: 'a',
                style: {
                    background: '#fff'
                },
                children: ['w1', 'w2']
            }
        },
        "widgets": {
            'w1': {
                id: 'w1',
                name: 'b',
                style: {
                    background: 'red'
                }
            },
            'w2': {
                id: 'w2',
                name: 'c',
                style: {
                    display: 'none',
                    background: 'red'
                }
            }
        },
        "groups": {},
        "templates": {}
    }
    const viewModel = {}
    const api = new ScriptAPI(app, viewModel)
    const screenA = api.getScreen('a')
    expect(screenA).not.toBeUndefined()
    expect(screenA.getName()).toBe('a')
   

    const widgetB = screenA.getWidget('b')
    expect(widgetB).not.toBeUndefined()
    expect(widgetB.getName()).toBe('b')
    expect(widgetB.isHidden()).toBe(false)


    const widgetC = screenA.getWidget('c')
    expect(widgetC).not.toBeUndefined()
    expect(widgetC.getName()).toBe('c')
    expect(widgetC.isHidden()).toBe(true)

    screenA.setStyle({'background': 'black'})
    let deltas = api.getAppDeltas()
    expect(deltas.length).toBe(1)
    expect(deltas[0].type).toBe('Screen')
    expect(deltas[0].id).toBe('s1')
    expect(deltas[0].key).toBe('style')
    expect(deltas[0].style.background).toBe('black')

    widgetB.setStyle({'color': 'red'})
    deltas = api.getAppDeltas()
    expect(deltas.length).toBe(2)
    expect(deltas[1].type).toBe('Widget')
    expect(deltas[1].id).toBe('w1')
    expect(deltas[1].key).toBe('style')
    expect(deltas[1].style.color).toBe('red')

    widgetB.setProp({'label': 'ABC'})
    deltas = api.getAppDeltas()
    expect(deltas.length).toBe(3)
    expect(deltas[2].type).toBe('Widget')
    expect(deltas[2].id).toBe('w1')
    expect(deltas[2].key).toBe('props')
    expect(deltas[2].props.label).toBe('ABC')


    widgetB.setLabel('XYZ')
    deltas = api.getAppDeltas()
    expect(deltas.length).toBe(4)
    expect(deltas[3].type).toBe('Widget')
    expect(deltas[3].id).toBe('w1')
    expect(deltas[3].key).toBe('props')
    expect(deltas[3].props.label).toBe('XYZ')

    widgetC.setLabel(456)
    deltas = api.getAppDeltas()
    expect(deltas.length).toBe(5)
    expect(deltas[4].type).toBe('Widget')
    expect(deltas[4].id).toBe('w2')
    expect(deltas[4].key).toBe('props')
    expect(deltas[4].props.label).toBe(456)


    widgetB.hide()
    deltas = api.getAppDeltas()
    expect(deltas.length).toBe(6)
    expect(deltas[5].type).toBe('Widget')
    expect(deltas[5].id).toBe('w1')
    expect(deltas[5].key).toBe('style')
    expect(deltas[5].style.display).toBe('none')

    widgetB.show()
    deltas = api.getAppDeltas()
    expect(deltas.length).toBe(7)
    expect(deltas[6].type).toBe('Widget')
    expect(deltas[6].id).toBe('w1')
    expect(deltas[6].key).toBe('style')
    expect(deltas[6].style.display).toBe('block')



})