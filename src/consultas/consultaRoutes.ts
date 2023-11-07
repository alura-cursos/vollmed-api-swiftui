/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { atualizaHorarioConsulta, buscaConsultaPorId, criaConsulta, deletaConsulta, listaConsultas } from './consultaController'
import errorMiddleware from '../error/errorMiddleware'
import { verificaTokenJWT } from '../auth/verificaTokenJWT'
import { Role } from '../auth/roles'

export const consultaRouter = Router()
consultaRouter.post('/', verificaTokenJWT(Role.paciente), criaConsulta)
consultaRouter.get('/', listaConsultas)
consultaRouter.get('/:id', verificaTokenJWT(Role.paciente), buscaConsultaPorId)
consultaRouter.patch('/:id', verificaTokenJWT(Role.paciente), atualizaHorarioConsulta)
consultaRouter.delete('/:id', verificaTokenJWT(Role.paciente), deletaConsulta)

export default (app) => {
  app.use("/consulta", consultaRouter);
};
