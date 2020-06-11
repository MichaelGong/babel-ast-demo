async function asyncFunc() {
  const val = await Promise.resolve(2)
  console.log(val)
}

const a = () => {
  console.log('1')
}

const obj = {
  a: function() {
    console.log('2323')
  }
}

asyncFunc()
