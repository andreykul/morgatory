Rails.application.routes.draw do
  root to: 'mortgages#show'
  resource :mortgage, only: [:show, :create]
end
