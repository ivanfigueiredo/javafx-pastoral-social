package com.pastoral.social.demo.adapters.factory;

import com.pastoral.social.demo.adapters.controller.CadastroAlimentoController;
import com.pastoral.social.demo.adapters.controller.ListAlimentosController;
import com.pastoral.social.demo.application.exceptions.InternalServerErrorException;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.function.Consumer;

public final class ControllerFactoryRegistry {
    private static final Map<Class<?>, Consumer<?>> registry = new HashMap<>();

    static {
        registry.put(CadastroAlimentoController.class, (CadastroAlimentoController cadastroAlimentoController) -> {
            cadastroAlimentoController.setAdicionarAlimentoUseCase(ResolveDependencyFactory.createAdicionarAlimentoUseCase());
            cadastroAlimentoController.setListUnidadeDeMedidasUseCase(ResolveDependencyFactory.createListUnidadeDeMedidasUseCase());
            cadastroAlimentoController.setListCategoriaUseCase(ResolveDependencyFactory.createListCategoriaUseCase());
            cadastroAlimentoController.setListLocalizacaoUseCase(ResolveDependencyFactory.createListLocalizacaoUseCase());
            cadastroAlimentoController.setup();
        });
        registry.put(ListAlimentosController.class, (ListAlimentosController listAlimentosController) -> {
            listAlimentosController.setListarAlimentosUseCase(ResolveDependencyFactory.createListarAlimentosUseCase());
            listAlimentosController.setup();
        });
    }

    private ControllerFactoryRegistry() {}

    @SuppressWarnings("unchecked")
    public static <T> void inject(T controller) {
        final Consumer<T> consumer = (Consumer<T>) registry.get(controller.getClass());
        if (Objects.nonNull(consumer)) {
            consumer.accept(controller);
        } else {
            throw new InternalServerErrorException("Nenhum registro encontrado para o controller " + controller.getClass().getName());
        }
    }
}
