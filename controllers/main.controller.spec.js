const {getRoot} = require('./main.controller')

describe("main.controller.getRoot", () =>{
    it('should call res.status with 200 and call json with given schema', () =>{
        const request = jest.fn()
        const response = jest.fn()
        response.status = jest.fn(() => response)
        response.json = jest.fn(() => response)

        getRoot(request, response)

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({
            status: 'OK',
            data: null
        });
    })
})