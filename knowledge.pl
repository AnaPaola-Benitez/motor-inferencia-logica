% knowledge.pl

% Hechos
contract(contract1).
contract(contract2).
late_payment(contract1).

% Reglas
% Una penalidad es aplicable si existe un contrato y tiene un pago atrasado.
penalty_applicable(X) :- contract(X), late_payment(X).